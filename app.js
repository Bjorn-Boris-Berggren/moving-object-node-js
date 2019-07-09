/**
 *app.js
 *
 * This is the main file and the first file to be run. The main function is a state machine which makes sure that the correct functions are invoked at given time.
 * There are two additional functions storeSizePosition(), runSimulation() and convertEndian(). The latter is for future use only,
 * if the endian needs to be changed of an output integer.
 *
 *@author: Björn Boris Berggren
 */

    //let rebuilt
let Matrix = require('./Matrix.js');
let MovingObject = require('./MovingObject.js');
let InputHandler = require('./InputHandler.js');

/**
 * Handles all the user input. It formats and validates the input. All user input MUST pass this object before usage.
 * @type {InputHandler}
 */
let theInputHandler = new InputHandler();

 /**
 * The Matrix-object mainly used to store the size and to check the boundaries
 * @type {Matrix}
 */
 let theMatrix = new Matrix();

// Contains size of the matrix [x,y]
theMatrix.size = new Int16Array(2);

/**
 * The object in motion. It stores and calculates the position and the direction.
 * @type {MovingObject}
 */
let theMovingObject = new MovingObject();
// Will contain the position [x,y]
theMovingObject.position = new Int16Array(2);


/**
 * The overall states for the app
 *
 * @type {Object}
 */
const states = {
    STORE_SIZE_POSITION: 1,
    RUN_SIMULATION: 2,
    RERUN: 3
};

/**
 * The current state of the state machine
 * @type {number}
 */
let currentState = states.STORE_SIZE_POSITION;

/**
 * Messages to the user
 *
 * @type {Object}
 */
const messages = {
    TYPE_SIZE_POSITION: 'Type the size of the matrix and the position of the object: width,height,x,y',
    COMMANDS_MENU: 'Type simulation commands, use comma to separate the commands e.g. \'1,3,1,1,0\':\n' +
        '0 = quit simulation and the print result\n' +
        '1 = move forward one step\n' +
        '2 = move backwards one step\n' +
        '3 = rotate clockwise 90 degrees (e.g. north to east)\n' +
        '4 = rotate counterclockwise 90 degrees (e.g. west to south)',
    PRESS_KEY: 'Press any key and enter to continue..',
    ERROR: 'Incorrect character or incorrect amount of characters, please try again'
};

/**
 * All the defined directions
 *
 * @type {Object}
 */
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
 * @type {Object}
 */
const predefinedCommands = {

    QUIT: 0,
    FORWARD: 1,
    BACKWARD: 2,
    ROTATE: 3,
    COUNTERROTATE: 4

};

// Max value for a command
theInputHandler.commandMaxValue = 4;

console.log(messages.TYPE_SIZE_POSITION);

//process.stdin.setEncoding('utf16le');
//process.stdout.setEncoding('utf16le');
/**
 * This is the main function, it reads the input and has a state machine
 *
 */
process.stdin.on('data', function (inputUTF8Codes) {

    /**
     * @type {Int8Array}
     */
    let userInputParsedToDigits;
    // Rerun(State3) does not use any input from user
    if (currentState !== states.RERUN) {
        // Will get the converted version containing integers, one digit per slot, comma=-1
        userInputParsedToDigits = theInputHandler.convertUserInputToDigits(inputUTF8Codes);
    }

    // State1: SizePosition state2: Simulation state3: Output
    switch (currentState) {

        case states.STORE_SIZE_POSITION:
            if (theInputHandler.checkInputStoreSizePosition(userInputParsedToDigits)) {
                storeSizePosition(userInputParsedToDigits);
                currentState = states.RUN_SIMULATION;
                console.log(messages.COMMANDS_MENU);
            } else {
                console.log(messages.ERROR);
            }
            break;
        case states.RUN_SIMULATION:
            if (theInputHandler.checkInputRunSimulation(userInputParsedToDigits)) {
                // Starts simulation and prints the output
                console.log('Output: [' + runSimulation(userInputParsedToDigits) + ']');
                currentState = states.RERUN;
                console.log(messages.PRESS_KEY);
            } else {
                console.log(messages.ERROR);
            }
            break;
        case states.RERUN:
            currentState = states.STORE_SIZE_POSITION;
            theMovingObject.direction = 1;
            console.log(messages.TYPE_SIZE_POSITION);
            break;
        default:
    }
});


/**
 * Calculates and stores the size and postion from user, state1
 * @param {Int8Array} userInputDigits contains the input from user each slot contains one digit comma is represented by -1
 */
function storeSizePosition(userInputDigits) {

    let userInput16 = new Int16Array(1);
    let theArrayBuffer = new ArrayBuffer(16);
    let slotsPerInt = 2;
    // All values are stored here, 2 slots per int
    let theDataView = new DataView(theArrayBuffer);

    let bool = false;

    let currentValue = 0;
    let userInt16Index = 0;
    let exp = 0;

    for (let i = 0; i < userInputDigits.length; i++) {

        if (userInputDigits[i] !== -1) {
            userInput16[0] += (userInputDigits[i] * Math.pow(10, exp));
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

