# moving-object-node-js
This task was given to me. It is a Node.js console app that simulates a moving object in a matrix. 

## The Task
The task is to accept a set of commands and then simulate whether an object can move according to these commands without 
falling off the table it stands on. The table can be seen as a matrix where the object will have an x and y position as drawn below. 
The object always occupies exactly one cell and can be seen as a point without mass. Origo is at the top left. No "String" 
objects or variables are allowed to be used while parsing the input. The input from user MUST be saved and handled as integers. 
After simulation, the app outputs the final position: [x,y]. If the object falls out of the matrix the app MUST output [-1,-1]. 
The size of the matrix and the position MUST be stored as arrays containing 16-bit integers. Thus, the output MUST contain 
an array with two 16-bit integers: [x,y]\(final position\) or [-1,-1]. The simulation commands from the second user input MUST be stored as 8-bit
integers. String-types SHALL NOT be used during parsing of any user input. For future use there SHOULD be a function which
changes the 'endian' of the integers e.g. convert big endian to little endian.   

## Commands
The object always has a direction (north, east, south or west). A simulation always starts with direction north. 
North means that if the object sits on [2, 4] and moves forward one step, the object will now stand on [2, 3].

The commands are:<br />
0 = Quit simulation and the print result to stout<br />
1 = Move forward one step<br />
2 = Move backwards one step<br />
3 = Rotate clockwise 90 degrees (eg north to east)<br />
4 = Rotate counterclockwise 90 degrees (eg west to south)<br />
<br />
Use comma as separator between commands.

## Example
If the program gets 4,4,2,2 as input, the table is initiated to size 4 x 4 with the object in position [2, 2] with direction 
north. Then, e.g. commands 1,4,1,3,2,3,2,4,1,0 are read from stdin and executed. The final output would then be the end position 
of the object, in this case [0, 1].

## Things to keep in mind
It is always possible to solve the task without any real structure, but the point here is to use a well known object oriented 
and/or functional architecture. A good code structure should also allow for expanded functionality in the future. For example, 
would it be easy to:
- Handle a different shapes other than a rectangle - Add more commands
- Change the binary form of the protocol to JSON Timing
- Estimated time to complete this task is around 8 hours.

