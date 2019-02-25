## Knights Tour

The knights tour is a game where the player attempts to reach every spot on a chessboard using only
the knight. 

Growing up, this was always a fascinating problem to me for several reasons. The solution seemed ambigious and 
mysterious: How do I place the knight on the board in such a way that I can reach all the pieces? Is there a heuristic that can 
be used? What's the best method to solve it?

Turns out the solution is fairly straightforward and can be programmed using a simple lookahead function. The heuristic
is known as [Warnsdorf's Rule](https://en.wikipedia.org/wiki/Knight%27s_tour#Warnsdorf's_rule).


Warnsdorf's Rule:

Warnsdorf's heuristic is simple: *The knight is moved so that it always proceeds to the square from which the knight will have the fewest onward moves*
This can be broken down into the following procedure, or algorithm:

1. From the knight's position, evaluate possible moves, labeled 1 - N
2. Assume the knight moves to each position 1 - N
    1. From each position, re-evaluate the number of moves from the new position. Count and store them
    2. Perform this operation for each possible move. Compare the number of moves. Assuming K
    to be the total count of moves, the min of K[i-n] becomes the candidate for the next move.
3. Move the knight to the optimal position. Return to step 1.

How to Run:

There are two launchpoints for this application, and they're contained in basic html files. The html files
launch the boards, and you can view them locally on your own machine and view the source files from there.
These two html files have different functions, respectively, and are located in the tests folder.

1. board.html -- This shows the heuristic in action, placing a knight to a preset location on the board,
and moving the knight in a timed fashion along the board using Warnsdorf's Rule.

2. board_2.html -- This is a more involved example, in the form of a game. It's fairly simple and not
entirely complete, but it works as follows:
    1. Hit start game. Place the knight on the board. 
    2. A number of moves will pop up in green (the number does not correspond to a likelihood or anything,
    it's just a number). Choose a spot to move the knight to.
    3. If you'd like the computer to help you choose a move, select Help from the board
    4. Move Count does not currently do anything
    5. Choose End Game to finish the game, and Start Game to restart the process

This was a fun project to work on. I use Phaser for the animations and tweening, and generated
the board using Tiled.   

Installation:

You'll have to install node modules before starting. I need to update these as well. (Node upgrades so often!)

