/**
*app.js
*
*This is the main file and the first file to run. It is a state machine which uses classes MovingObject and
* Matrix to simulate an object in motion on a rectangular field.
*
* @author: Björn Berggren
 */

 //console.log(convertEndian(0xDAFA));

const MovingObject = require('./movingobject.js');
const Matrix = require('./matrix.js');
var rebuilt = '';



// Object which checks the boundaries and size of the field
var theMatrix = new Matrix();
theMatrix.size = new Int16Array(2);


var theMovingObject = new MovingObject();
theMovingObject.position = new Int16Array(2);


// The overall states for the app
const states = {
    STATE1: 'SizePosition',
    STATE2: 'Simulation',
    STATE3: 'Rerun'
}

var theState = states.STATE1;

// Messages to the user
const messages = {

    MSG_SIZEPOS:  'Type the size of the matrix and the position of the object: width,height,x,y',
    MSG_COMMANDS: 'Type simulation commands, use comma to separate the commands e.g. \'1,3,1,1,0\':\n' +
                  '0 = quit simulation and the print result\n' +
                  '1 = move forward one step\n'  +
                  '2 = move backwards one step\n'  +
                  '3 = rotate clockwise 90 degrees (eg north to east)\n' +
                  '4 = rotate counterclockwise 90 degrees (eg west to south)',
    MSG_PRESSKEY: 'Press any key and enter to continue..',
    MSG_ERROR:    'Incorrect character or incorrect amount of characters, please try again'

}

// MovinbObjects current direction: 1=North 2=East 3=South 4=West
theMovingObject.direction = 1;
// All the defined directions
const directions = {
    NORTH:      1,
    EAST:       2,
    SOUTH:      3,
    WEST:       4
}
/*  Simulation execution
0 = quit simulation and print results to stdout
1 = move forward one step
2 = move backwards one step
3 = rotate clockwise 90 degrees (eg north to east)
4 = rotate counterclockwise 90 degrees (eg west to south)
*/
const predefinedCommands = {

    QUIT:           0,
    FORWARD:        1,
    BACKWARD:       2,
    ROTATE:         3,
    COUNTERROTATE:  4

}
amountOfCommands = 4;


console.log(messages.MSG_SIZEPOS);

//process.stdin.setEncoding('utf16le');
//process.stdout.setEncoding('utf16le');
//This is the main function, it reads the input and has a state machine
process.stdin.on('data', function (inputUTF8Codes) {

    var userInput8ArrayParsed;
    // State3 does not use any input from user
    if(theState != states.STATE3)
    {
        // Will get the converted version containing integers, one digit per slot, comma=-1
        userInput8ArrayParsed = parseUserInput(inputUTF8Codes);
    }
    // State1: SizePosition state2: Simulation state3: Output
    switch (theState) {

        case states.STATE1:
            if (checkInputState1(userInput8ArrayParsed)) {
                readInputSizePosition(userInput8ArrayParsed);
                theState = states.STATE2;
                console.log(messages.MSG_COMMANDS);
            } else {
                console.log(messages.MSG_ERROR);
            }
            break;
        case states.STATE2:
            if (checkInputState2(userInput8ArrayParsed)) {
                //Starts simulation and prints the output
                console.log('Output: [' + runSimulation(userInput8ArrayParsed) + ']');
                theState = states.STATE3;
                console.log(messages.MSG_PRESSKEY);
            } else {
                console.log(messages.MSG_ERROR);
            }
            break;
        case states.STATE3:
            theState = states.STATE1;
            theMovingObject.direction = 1;
            console.log(messages.MSG_SIZEPOS);
            break;
        default:
    }
});


process.stdin.on('end', function () {
    console.log(rebuilt);
});

/**
 * Reads and stores the input and size from user, state1
 * @param {array} userInput8ArrayParsedPar contains the input from user each slot contains one digit comma is represented by -1
 */

function readInputSizePosition(userInput8ArrayParsedPar) {

    var userInput8ArrayParsed = userInput8ArrayParsedPar;

    var userInput16 = new Uint16Array(1);
    var theArrayBuffer = new ArrayBuffer(16);
    var slotsPerInt = 2;
    // All values are stored here, 2 slots per int
    var theDataView = new DataView(theArrayBuffer);

    var bool = false;

    var currentValue = 0;
    var userInt16Index = 0;
    var exp = 0;

    for (var i = 0; i < userInput8ArrayParsed.length; i++) {

        if (userInput8ArrayParsed[i] != -1) {
            userInput16[0] += (userInput8ArrayParsed[i] * Math.pow(10, exp));
            exp++;
        } else {
            theDataView.setInt16(currentValue, userInput16[0], true)
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

// Parses the input and converts it from UTF-8 to the integers which they symbolise, comma is represented by -1.
function parseUserInput(inputUTF8Codes) {

    var theBuffer = (Buffer.from(inputUTF8Codes));

    var input8Array = new Uint8Array(theBuffer);
    // will contain the converted version of the input one digit per slot, comma=-1
    var commandsOutput8Array = new Int8Array(theBuffer);

    var index = (commandsOutput8Array.length - 2);
    commandsOutput8Array[(commandsOutput8Array.length - 1)] = -1;

    // Parses the user input and converts from UTF-8-code to digits
    for (var i = 0; i < input8Array.length; i++) {

        if ((input8Array[i] != 44)) {
            commandsOutput8Array[index] = input8Array[i] - 48;

        } else {
            commandsOutput8Array[index] = -1;
        }

        index--;
    }
    return commandsOutput8Array;
}

/*

*This function executes the simulation.
0 = QUIT = quit simulation and print results to stdout
1 = FORWARD =move forward one step
2 = BACKWARD = move backwards one step
3 = ROTATE = rotate clockwise 90 degrees (eg north to east)
4 = COUNTERROTATE = rotate counterclockwise 90 degrees (eg west to south)
*/
function runSimulation(selectedCommands) {


    for (var i = (selectedCommands.length - 1); i >= 0; i--) {


        if (selectedCommands[i] == predefinedCommands.FORWARD || selectedCommands[i] == predefinedCommands.BACKWARD) {
            theMovingObject.move(selectedCommands[i], predefinedCommands, directions);
            if (theMatrix.validPosition(theMovingObject.position) == -1) {
                theMovingObject.position[0] = -1;
                theMovingObject.position[1] = -1;
                return theMovingObject.position;
            }
        } else if (selectedCommands[i] == predefinedCommands.ROTATE || selectedCommands[i] == predefinedCommands.COUNTERROTATE) {
            theMovingObject.rotate(selectedCommands[i], predefinedCommands, directions);
        } else if (selectedCommands[i] == predefinedCommands.QUIT) {
            return theMovingObject.position;
        }

    }

    return theMovingObject.position;

}

// Checks the input from state1, only 4 integers are allowed and comma
function checkInputState1(userInput8ArrayParsedPar) {

    var userInput8ArrayParsed = userInput8ArrayParsedPar;

    //userInput8ArrayParsed = parseUserInput(theBuffer);
    var amaountOfNumbers = 0;
    var firstBytecontainsNoneZero = false;
    var secondByteContainsNoneZero = false;

    for (var i = 0; i < userInput8ArrayParsed.length; i++) {
        if (userInput8ArrayParsed[i] > 9)
            return false;
        if (userInput8ArrayParsed[i] < (-1))
            return false;
        if (amaountOfNumbers == 3 && (userInput8ArrayParsed[i] > 0)) {
            firstBytecontainsNoneZero = true;
        }

        if (amaountOfNumbers == 2 && (userInput8ArrayParsed[i] > 0)) {
            secondByteContainsNoneZero = true;
        }


        if (userInput8ArrayParsed[i] == -1) {
            amaountOfNumbers++;
            if (amaountOfNumbers > 4)
                return false;
        }
    }
    if (amaountOfNumbers < 4) {
        return false;
    }
    if(firstBytecontainsNoneZero==false || secondByteContainsNoneZero==false)
        return false;

    return true;
}

// Checks the input from state2, only 0-4 are allowed and comma
function checkInputState2(userInput8ArrayParsedPar) {
    var userInput8ArrayParsed = userInput8ArrayParsedPar;
    if (userInput8ArrayParsed.length < 2) {
        return false;
    }

    for (var i = 0; i < userInput8ArrayParsed.length; i++) {
        if (userInput8ArrayParsed[i] > amountOfCommands)
            return false;
        if (userInput8ArrayParsed[i] < (-1))
            return false;
    }

    return true;
}

function test(theInt) {

}
/*
* For future use, flips the endian. e.g. from little endia to big endian.
 */
function convertEndian(theInt) {
    var temp=0;
    temp = theInt<<8;
    temp = temp & 0xFFFF;
    theInt = theInt>>8;
    theInt = theInt | temp;

    return theInt.toString(16);

}