/**
*matrix.js
*
* This class symbolises the area where the object is moving, the major purpose with this is to store the boundaries,
* and make sure that boundaries are not passed. In the future it can be possible to create different fields that are not rectangular
* with the matrix property.
*
* @author: Björn Boris Berggren
*
 */
class Matrix {

    /**
     * Creates a new Matrix.
     * @class
     */
    constructor() {
    }
    /**
     *  The size of this object [width,height]
     * @type {Int16Array}
     */
    set size(size) {
        this._size = size;
    }
    /**
     *  The size of this object [width,height]
     *
     */
    get size() {
        return this._size;
    }

    /**
     * For future use, this will contain a two dimensional boolean-matrix which will occupy positions where you are not allowed to go
     * @type {Array}
     */
    set matrix(matrix) {
        this._matrix = matrix;
    }

    /**
     * For future use, this will contain a boolean-matrix which will occupy positions where you are not allowed to go
     * @type {Array}
     */
    get matrix() {
        return this._matrix;
    }

    /**
     * Checks whether the object is outside the matrix
     * @param {Int16Array} position contains the new position after a move [x,y]
     * @returns {boolean} True if object is outside this matrix
     * */
    checkIfObjectIsOutside(position) {

        if (position[0] < 0 || position[0] > (this._size[0] - 1)) {
            return true;

        } else if (position[1] < 0 || position[1] > (this._size[1] - 1)) {
            return true;
        }

        return false;

    };

}

module.exports = Matrix;

