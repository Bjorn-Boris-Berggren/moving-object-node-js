/**
 *app.js
 *
 * This is the main file and the first file to run. It is a state machine which uses classes MovingObject and
 * Matrix to simulate an object in motion on a rectangular field.
 *
 *@author: Björn Boris Berggren
 */

    //let rebuilt
let Matrix = require('./Matrix.js');
let MovingObject = require('./MovingObject.js');


// Object which checks the boundaries and size of the field
let theMatrix = new Matrix();

// Contains size of the matrix [x,y]
theMatrix.size = new Int16Array(2);


let theMovingObject = new MovingObject();
// Will contain the position [x,y]
theMovingObject.position = new Int16Array(2);

// The overall states for the app
const states = {
    STATE1: 'SizePosition',
    STATE2: 'Simulation',
    STATE3: 'Rerun'
};

let currentState = states.STATE1;

// Messages to the user
const messages = {
    MSG_SIZEPOS: 'Type the size of the matrix and the position of the object: width,height,x,y',
    MSG_COMMANDS: 'Type simulation commands, use comma to separate the commands e.g. \'1,3,1,1,0\':\n' +
        '0 = quit simulation and the print result\n' +
        '1 = move forward one step\n' +
        '2 = move backwards one step\n' +
        '3 = rotate clockwise 90 degrees (eg north to east)\n' +
        '4 = rotate counterclockwise 90 degrees (eg west to south)',
    MSG_PRESSKEY: 'Press any key and enter to continue..',
    MSG_ERROR: 'Incorrect character or incorrect amount of characters, please try again'
};

// All the defined directions
const directions = {
    NORTH: 1,
    EAST: 2,
    SOUTH: 3,
    WEST: 4
};

/**
 * Simulation execution
 * 0 = quit simulation and print results to stdout
 * 1 = move forward one step
 * 2 = move backwards one step
 * 3 = rotate clockwise 90 degrees (eg north to east)
 * 4 = rotate counterclockwise 90 degrees (eg west to south)
 */
const predefinedCommands = {

    QUIT: 0,
    FORWARD: 1,
    BACKWARD: 2,
    ROTATE: 3,
    COUNTERROTATE: 4

};
// Max value for a command
let commandMaxValue = 4;

// Amount of commands from user input
let amountInputCommands = 1;

console.log(messages.MSG_SIZEPOS);

//process.stdin.setEncoding('utf16le');
//process.stdout.setEncoding('utf16le');
/**
 * This is the main function, it reads the input and has a state machine
 *
 */
process.stdin.on('data', function (inputUTF8Codes) {


    let userInput8ArrayParsed;
    // State3 does not use any input from user
    if (currentState !== states.STATE3) {
        // Will get the converted version containing integers, one digit per slot, comma=-1
        userInput8ArrayParsed = convertUserInputToDigits(inputUTF8Codes);
    }

    // State1: SizePosition state2: Simulation state3: Output
    switch (currentState) {

        case states.STATE1:
            if (checkInputState1(userInput8ArrayParsed)) {
                readInputSizePosition(userInput8ArrayParsed);
                currentState = states.STATE2;
                console.log(messages.MSG_COMMANDS);
            } else {
                console.log(messages.MSG_ERROR);
            }
            break;
        case states.STATE2:
            if (checkInputState2(userInput8ArrayParsed)) {
                //Starts simulation and prints the output
                console.log('Output: [' + runSimulation(userInput8ArrayParsed) + ']');
                currentState = states.STATE3;
                console.log(messages.MSG_PRESSKEY);
            } else {
                console.log(messages.MSG_ERROR);
            }
            break;
        case states.STATE3:
            currentState = states.STATE1;
            theMovingObject.direction = 1;
            console.log(messages.MSG_SIZEPOS);
            break;
        default:
    }
});


/**
 * Reads and stores the input and size from user, state1
 * @param {Int8Array} userInput8ArrayParsedPar contains the input from user each slot contains one digit comma is represented by -1
 */

function readInputSizePosition(userInput8ArrayParsedPar) {

    let userInput8ArrayParsed = userInput8ArrayParsedPar;

    let userInput16 = new Int16Array(1);
    let theArrayBuffer = new ArrayBuffer(16);
    let slotsPerInt = 2;
    // All values are stored here, 2 slots per int
    let theDataView = new DataView(theArrayBuffer);

    let bool = false;

    let currentValue = 0;
    let userInt16Index = 0;
    let exp = 0;

    for (let i = 0; i < userInput8ArrayParsed.length; i++) {

        if (userInput8ArrayParsed[i] !== -1) {
            userInput16[0] += (userInput8ArrayParsed[i] * Math.pow(10, exp));
            exp++;
        } else {
            theDataView.setInt16(currentValue, userInput16[0], true);
            userInput16[0] = 0;
            currentValue += slotsPerInt;
            exp = 0;
        }


    }

    theMovingObject.position[0] = theDataView.getInt16(2, true);
    theMovingObject.position[1] = theDataView.getInt16(0, true);
    theMatrix.size[0] = theDataView.getInt16(6, true);
    theMatrix.size[1] = theDataView.getInt16(4, true);
}

/**
 * Parses the input and converts it from UTF-8 to the integers which they symbolise, comma is represented by -1.
 *
 * @param {Buffer} inputUTF8Codes Contains the user input in UTF-8 code
 * @returns {Int8Array} Containes the user input in integers, comma is represented by -1.
 */
function convertUserInputToDigits(inputUTF8Codes) {
    let theBuffer = (Buffer.from(inputUTF8Codes));

    let input8Array = new Uint8Array(theBuffer);
    // will contain the converted version of the input one digit per slot, comma=-1
    let commandsOutput8Array = new Int8Array(theBuffer);

    let index = (commandsOutput8Array.length - 2);
    commandsOutput8Array[(commandsOutput8Array.length - 1)] = -1;

    // Parses the user input and converts from UTF-8-code to digits
    for (let i = 0; i < input8Array.length; i++) {

        if ((input8Array[i] !== 44)) {
            commandsOutput8Array[index] = input8Array[i] - 48;

        } else {
            commandsOutput8Array[index] = -1;
            amountInputCommands++;
        }

        index--;
    }
    return commandsOutput8Array;
}

/*

*This function executes the simulation.
* 0 = QUIT = quit simulation and print results to stdout
* 1 = FORWARD =move forward one step
* 2 = BACKWARD = move backwards one step
* 3 = ROTATE = rotate clockwise 90 degrees (eg north to east)
* 4 = COUNTERROTATE = rotate counterclockwise 90 degrees (eg west to south)
* @param {Int8Array} selectedCommands Contains all the commands from user input.
* @returns {number[]} Contains the position of the after the simulation
*/
function runSimulation(selectedCommands) {

    for (let i = (selectedCommands.length - 1); i >= 0; i--) {

        // Comma==-1
        if (selectedCommands[i] === -1) {

        } else if (selectedCommands[i] === predefinedCommands.FORWARD || selectedCommands[i] === predefinedCommands.BACKWARD) {
            theMovingObject.move(selectedCommands[i], predefinedCommands, directions);
            if (theMatrix.checkIfObjectIsOutside(theMovingObject.position)) {
                theMovingObject.position[0] = -1;
                theMovingObject.position[1] = -1;
                return theMovingObject.position;
            }
        } else if (selectedCommands[i] === predefinedCommands.ROTATE || selectedCommands[i] === predefinedCommands.COUNTERROTATE) {
            theMovingObject.rotate(selectedCommands[i], predefinedCommands, directions);
        } else if (selectedCommands[i] === predefinedCommands.QUIT) {
            return theMovingObject.position;
        }

    }

    return theMovingObject.position;

}

/**
 * Checks the input from state1, only 4 positive integers are allowed and -1(comma)
 * @param {Int8Array} userInput8ArrayParsedPar The user input containing size of the matrix and initial position of the object
 * @returns {boolean} true If the user input contains valid characters and values
 */
function checkInputState1(userInput8ArrayParsedPar) {
    let userInput8ArrayParsed = userInput8ArrayParsedPar;

    //userInput8ArrayParsed = convertUserInputToDigits(theBuffer);
    let amaountOfNumbers = 0;
    let firstBytecontainsNoneZero = false;
    let secondByteContainsNoneZero = false;

    for (let i = 0; i < userInput8ArrayParsed.length; i++) {
        if (userInput8ArrayParsed[i] > 9)
            return false;
        if (userInput8ArrayParsed[i] < (-1))
            return false;
        if (amaountOfNumbers === 3 && (userInput8ArrayParsed[i] > 0)) {
            firstBytecontainsNoneZero = true;
        }

        if (amaountOfNumbers === 2 && (userInput8ArrayParsed[i] > 0)) {
            secondByteContainsNoneZero = true;
        }


        if (userInput8ArrayParsed[i] === -1) {
            amaountOfNumbers++;
            if (amaountOfNumbers > 4)
                return false;
        }
    }
    if (amaountOfNumbers < 4) {
        return false;
    }
    return !(firstBytecontainsNoneZero === false || secondByteContainsNoneZero === false);


}

/**
 * Checks the input from state2, only 0-4 are allowed and -1(comma)
 * @param {Int8Array} userInput8ArrayParsedPar The user input containing the commands
 * @returns {boolean} True if the user input contains valid characters and values
 */
function checkInputState2(userInput8ArrayParsedPar) {
    let userInput8ArrayParsed = userInput8ArrayParsedPar;
    if (userInput8ArrayParsed.length < 2) {
        return false;
    }
    let sum = 0;
    let exp = 0;

    for (let i = 0; i < userInput8ArrayParsed.length; i++) {
        if (userInput8ArrayParsed[i] < (-1))
            return false;
        if (userInput8ArrayParsed[i] === -1) {
            sum = 0;
            exp = 0;
        } else {
            sum += (userInput8ArrayParsed[i] * Math.pow(10, exp));
            exp++;
        }
        if (sum > commandMaxValue) {
            return false;
        }
    }

    return true;
}

/**
 * For future use, flips the endian. e.g. from little endia to big endian.
 *
 * @param {number} nbrChangeEndian This integer will be edited
 * @returns {number}
 */
function convertEndian(nbrChangeEndian) {
    let temp = 0;
    temp = nbrChangeEndian << 8;
    temp = temp & 0xFFFF;
    nbrChangeEndian = nbrChangeEndian >> 8;
    nbrChangeEndian = nbrChangeEndian | temp;


    return nbrChangeEndian;

}

