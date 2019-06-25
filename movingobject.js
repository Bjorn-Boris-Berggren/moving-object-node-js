/*
*MovingObject.js
*
*This class symbolises an object in motion. It contains its position and direction. It also handles the function for
* movement and rotation. But the Matrix class checks whether the object is inside the matrix.
*
*
* Created by: Björn Berggren
*
 */

class MovingObject {


    constructor() {
        this.id = 'id_1';
    }


    set position(position) {
        this._position = position;
    }

    get position() {
        return this._position;
    }

    set direction(direction) {
        this._direction = direction;
    }

    get direction() {
        return this._direction;
    }

    // Rotates the movingobject
    rotate(command, predefinedCommands, directions) {

        if (command == predefinedCommands.ROTATE) {
            this._direction++;
            if (this._direction > directions.WEST) {
                this._direction = directions.NORTH;
            }
        } else if (command == predefinedCommands.COUNTERROTATE) {
            this._direction--;
            if (this._direction < directions.NORTH) {
                this._direction = directions.WEST;
            }

        }
    };

    // Moves the movingobject
    move(command, predefinedCommands, directions) {

        if (this._direction == directions.NORTH || this._direction == directions.SOUTH) {

            if ((command == predefinedCommands.FORWARD && this._direction == directions.NORTH) || (command == predefinedCommands.BACKWARD && this._direction == directions.SOUTH)) {

                this._position[1]--;

            } else if ((command == predefinedCommands.FORWARD && this._direction == directions.SOUTH) || (command == predefinedCommands.BACKWARD && this._direction == directions.NORTH)) {
                this._position[1]++;
            }

        } else if (this._direction == directions.EAST || this._direction == directions.WEST) {
            if ((command == predefinedCommands.FORWARD && this._direction == directions.EAST) || (command == predefinedCommands.BACKWARD && this._direction == directions.WEST)) {
                this._position[0]++;

            } else if ((command == predefinedCommands.FORWARD && this._direction == directions.WEST) || (command == predefinedCommands.BACKWARD && this._direction == directions.EAST)) {
                this._position[0]--;
            }


        }
        return 1;

    }

};


module.exports = MovingObject;


