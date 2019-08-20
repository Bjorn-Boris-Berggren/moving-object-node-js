/**
 * MovingObject.js
 *
 * This class symbolises an object in motion. It contains its position and direction. It also handles the function for
 * movement and rotation. But the Matrix class checks whether the object is inside the matrix.
 *
 *
 * @author: Björn Boris Berggren
 *
 */
class MovingObject {

  /**
   * Creates a new MovingObject.
   * @class
   */
  constructor() {
    /*
     *   Default MUST be 1
     */
    this._direction = 1;
  }


  /**
   *  The position of this object [x,y]
   * @type {Int16Array}
   */
  set position(position) {
    this._position = position;
  }

  get position() {
    return this._position;
  }

  /**
   * The direction of this object
   * @type {number}
   */
  set direction(direction) {
    this._direction = direction;
  }

  get direction() {
    return this._direction;
  }

  /**
   * Rotates this object
   *
   * @param {number} command The command for the rotation, it is either clockwise (3) or counterclockwise (4)
   * @param {object} predefinedCommands This object contains all the defined commands
   * @param {object} directions this object contains all the defined directions
   */

  rotate(command, predefinedCommands) {
    if (command === predefinedCommands.ROTATE) {
      this._direction++;
      if (this._direction > DIRECTIONS.WEST) {
        this._direction = DIRECTIONS.NORTH;
      }
    } else if (command === predefinedCommands.COUNTERROTATE) {
      this._direction--;
      if (this._direction < DIRECTIONS.NORTH) {
        this._direction = DIRECTIONS.WEST;
      }

    }
  };

  /**
   * Moves this object
   *
   * @param {number} command The command for the movement, it is either forward (1) or backward (2)
   * @param {object} predefinedCommands This object contains all the defined commands
   * @param {object} directions this object contains all the defined directions
   */

  move(command, predefinedCommands) {

    if (this._direction === DIRECTIONS.NORTH || this._direction === DIRECTIONS.SOUTH) {

      if ((command === predefinedCommands.FORWARD && this._direction === DIRECTIONS.NORTH) || (command === predefinedCommands.BACKWARD && this._direction === DIRECTIONS.SOUTH)) {

        this._position[1]--;

      } else if ((command === predefinedCommands.FORWARD && this._direction === DIRECTIONS.SOUTH) || (command === predefinedCommands.BACKWARD && this._direction === DIRECTIONS.NORTH)) {
        this._position[1]++;
      }

    } else if (this._direction === DIRECTIONS.EAST || this._direction === DIRECTIONS.WEST) {
      if ((command === predefinedCommands.FORWARD && this._direction === DIRECTIONS.EAST) || (command === predefinedCommands.BACKWARD && this._direction === DIRECTIONS.WEST)) {
        this._position[0]++;

      } else if ((command === predefinedCommands.FORWARD && this._direction === DIRECTIONS.WEST) || (command === predefinedCommands.BACKWARD && this._direction === DIRECTIONS.EAST)) {
        this._position[0]--;
      }


    }
    return 1;

  }

}

/**
 * All the defined directions
 *
 * @type {Object}
 */

const DIRECTIONS = {
  NORTH: 1,
  EAST: 2,
  SOUTH: 3,
  WEST: 4
};


module.exports = MovingObject;


