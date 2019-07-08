/**
* movingObject.js
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

    /**
     * The position of this object [x,y]
     * @type {Int16Array}
     */
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

    /**
     * The direction of this object
     * @type {number}
     */
    get direction() {
        return this._direction;
    }

    /**
     * Rotates this object
     * @param{number}
     * @param{object}
     * @param{object}
     */
    rotate(command, predefinedCommands, directions) {
        console.log(typeof command);
        console.log(typeof predefinedCommands);
        console.log(typeof directions);

        if (command === predefinedCommands.ROTATE) {
            this._direction++;
            if (this._direction > directions.WEST) {
                this._direction = directions.NORTH;
            }
        } else if (command === predefinedCommands.COUNTERROTATE) {
            this._direction--;
            if (this._direction < directions.NORTH) {
                this._direction = directions.WEST;
            }

        }
    };

    /**
     * Moves this object
     * @param{number}
     * @param{object}
     * @param{object}
     */
    move(command, predefinedCommands, directions) {

        if (this._direction === directions.NORTH || this._direction === directions.SOUTH) {

            if ((command === predefinedCommands.FORWARD && this._direction === directions.NORTH) || (command === predefinedCommands.BACKWARD && this._direction === directions.SOUTH)) {

                this._position[1]--;

            } else if ((command === predefinedCommands.FORWARD && this._direction === directions.SOUTH) || (command === predefinedCommands.BACKWARD && this._direction === directions.NORTH)) {
                this._position[1]++;
            }

        } else if (this._direction === directions.EAST || this._direction === directions.WEST) {
            if ((command === predefinedCommands.FORWARD && this._direction === directions.EAST) || (command === predefinedCommands.BACKWARD && this._direction === directions.WEST)) {
                this._position[0]++;

            } else if ((command === predefinedCommands.FORWARD && this._direction === directions.WEST) || (command === predefinedCommands.BACKWARD && this._direction === directions.EAST)) {
                this._position[0]--;
            }


        }
        return 1;

    }

}

module.exports = MovingObject;


