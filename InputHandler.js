/**
 * InputHandler.js
 *
 * This handles all user input. It validates and formats it. All user input MUST pass this class.
 *
 *
 * @author: Björn Boris Berggren
 *
 */

class InputHandler {


  /**
   * Creates a new InputHandler.
   * @class
   */

  constructor() {
    this._commandMaxValue = 1;
  }

  /**
   * The last command in the object i.e. max allowed value for commands
   * @type {number}
   */

  set commandMaxValue(commandMaxValue) {
    this._commandMaxValue = commandMaxValue;
  }

  get commandMaxValue() {
    return this._commandMaxValue;
  }

  /**
   * Parses the input and converts it from UTF-8 to the integers which they symbolise, comma is represented by -1.
   *
   * @param {Buffer} inputUTF8Codes Contains the user input in UTF-8 code
   * @returns {Int8Array} Containes the user input in integers, comma is represented by -1.
   */

  convertUserInputToDigits(inputUTF8Codes) {
    let theBuffer = (Buffer.from(inputUTF8Codes));
    // Amount of commands from user input
    let amountInputCommands = 1;

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


  /**
   * Checks the input from state1: size and position, only 4 positive integers are allowed and -1(comma)
   * @param {Int8Array} userInputParsedToDigits The user input containing size of the matrix and initial position of the object
   * @returns {boolean} true If the user input contains valid characters and values
   */

  checkInputStoreSizePosition(userInputParsedToDigits) {

    //userInputParsedToDigits = convertUserInputToDigits(theBuffer);
    let amaountOfNumbers = 0;
    let firstBytecontainsNoneZero = false;
    let secondByteContainsNoneZero = false;

    for (let i = 0; i < userInputParsedToDigits.length; i++) {
      if (userInputParsedToDigits[i] > 9)
        return false;
      if (userInputParsedToDigits[i] < (-1))
        return false;
      if (amaountOfNumbers === 3 && (userInputParsedToDigits[i] > 0)) {
        firstBytecontainsNoneZero = true;
      }

      if (amaountOfNumbers === 2 && (userInputParsedToDigits[i] > 0)) {
        secondByteContainsNoneZero = true;
      }

      if (userInputParsedToDigits[i] === -1) {
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
   * Checks the input from state2: run simulation, only 0-4 are allowed and -1(comma)
   * @param {Int8Array} userInputParsedToDigits The user input containing the commands
   * @returns {boolean} True if the user input contains valid characters and values
   */

  checkInputRunSimulation(userInputParsedToDigits) {

    if (userInputParsedToDigits.length < 2) {
      return false;
    }
    let sum = 0;
    let exp = 0;

    for (let i = 0; i < userInputParsedToDigits.length; i++) {
      if (userInputParsedToDigits[i] < (-1))
        return false;
      if (userInputParsedToDigits[i] === -1) {
        sum = 0;
        exp = 0;
      } else {
        sum += (userInputParsedToDigits[i] * Math.pow(10, exp));
        exp++;
      }
      if (sum > this._commandMaxValue) {
        return false;
      }
    }

    return true;
  }

}

module.exports = InputHandler;

