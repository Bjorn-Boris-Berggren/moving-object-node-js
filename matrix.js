/*
*matrix.js
*
*This class symbolises the area where the object is moving, the major purpose with this is to store the boundaries,
* and make sure that boundaries are not passed. In the future it can be possible to create different fields that are not rectangular
* with the matrix property.
*
* Created by: Björn Berggren
*
 */

class Matrix {

    constructor() {
        this.id = 'id_2';
    }

    set size(size) {
        this._size = size;
    }

    get size() {
        return this._size;
    }

    // For future use, this will contain a boolean-matrix which will occupy positions where you are not allowed to go
    set matrix(matrix) {
        this._matrix = matrix;
    }

    // For future use
    get matrix() {
        return this._matrix;
    }

    //Checks whether the movement was correct
    validPosition(position) {

        if (position[0] < 0 || position[0] > (this._size[0] - 1)) {
            return -1;

        } else if (position[1] < 0 || position[1] > (this._size[1] - 1)) {
            return -1;
        }

        return 1;

    };

};


module.exports = Matrix;

