/**
 * Created by hbeadles on 12/13/2016.
 */



var Engine = (function($){


    var game,
        map,
        background,
        board,
        squares,
        gridX,
        gridY,
        knight,
        width,
        working_path,
        move_number,
        height,
        destinationX,
        destinationY;


    var init = function(w, h){

        //Construct a new instance of Game

        width = w;
        height = h;

        game = new Phaser.Game(width,height, Phaser.CANVAS, 'content', {preload:preload, create: create, update:update, render:render});




    };


    var calculatePositions = function(){

        var innerSquares =[],
            xStart = 128,
            yStart = 128;
        //We start at our initial position


        for(var i=0; i<8; i++){
            innerSquares[i] = [];
            for(var j=0; j<8; j++){

                innerSquares[i][j] ={};

                innerSquares[i][j].x = xStart;
                innerSquares[i][j].y = yStart;

                innerSquares[i][j].marked = false;

            //Increment the height
                xStart += 64;
            }
            xStart = 128;
            yStart += 64;

        }

        return innerSquares;


    };




    var preload = function(){

        game.load.image('knight', '../assets/img/horse.png', 64, 64);
        game.load.tilemap('chess', '../assets/tiled_maps/board.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('dark_piece', '../assets/img/dark_piece.jpg');
        game.load.image('tan_piece', '../assets/img/tan_piece.jpg');


    };

    var create = function(){
        working_path =[];
        move_number =0;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,width, height);
        //Load in our board
        game.stage.backgroundColor = "#C0C0C0";

        map = game.add.tilemap('chess');
        map.addTilesetImage('tan_piece', 'tan_piece');
        map.addTilesetImage('dark_piece', "dark_piece");

        background = map.createLayer('background');
        background.resizeWorld();
        var style = { font: "bold 32px Arial", fill : "#000", boundsAlignH: "center", boundsAlignV: "top"};

        var text = game.add.text(0,0, "Knight Tour Example Heuristic 1.0", style);
        text.setTextBounds(0, 50, 800, 100);


        squares = calculatePositions();
        //This helps us know where to move the knight based on our grid.

        //Now, let's add in our knight, placing him at the start position.

        knight = game.add.sprite(128, 128, 'knight');

        game.physics.arcade.enable(knight);

        game.world.bringToTop(knight);

        gridX = 0;
        gridY = 0;
        squares[0][0].marked = true;
        drawRect(squares[0][0].x, squares[0][0].y);
        var style_2 = {font: "12px Arial", fill: "#000000", align:"center"};

        var text_2 = game.add.text( 128,128, "(x, y):" +"( " +gridX + "," + gridY + " )" + "\n" + " Move: " + working_path.length, style_2);

        game.world.moveDown(text_2);

        var chosen = scan(gridX, gridY);

        chosen = look_ahead(0, chosen);

        gridX = chosen[0];
        gridY = chosen[1];
        destinationX = squares[gridX][gridY].x;
        destinationY = squares[gridX][gridY].y;
        drawRect(destinationX, destinationY);
        drawText(destinationX, destinationY);
        var tweenKnight = game.add.tween(knight);
        move_number++;
        tweenKnight.to({x:destinationX, y:destinationY}, 1000, Phaser.Easing.Linear.None);
        tweenKnight.onComplete.add(move, this);
        tweenKnight.start();

        //We need to add some text.
        //This will help us organize our stuff




    };


    var move = function(knight, tween){

        var chosen = scan(gridX, gridY);
            chosen = look_ahead(0, chosen);
        gridX = chosen[0];
        gridY = chosen[1];
        destinationX = squares[gridX][gridY].x;
        destinationY = squares[gridX][gridY].y;


        setTimeout(function(){
            var tweenKnight = game.add.tween(knight);
            tweenKnight.to({x:destinationX, y:destinationY}, 1000, Phaser.Easing.Linear.None);
            tweenKnight.onComplete.add(move, this);
            tweenKnight.start();
            move_number++;
            drawRect(destinationX, destinationY);
            //Draw some coordinate text in the middle of each rectangle.
            drawText(destinationX, destinationY);


        }, 1000);




    };

    var drawRect = function(x, y){
        var graphics = game.add.graphics(0, 0);
        if((move_number >= 0 && move_number < 11)){
            graphics.beginFill(0x33ccff);
        }else if(move_number > 10 && move_number < 21){

            graphics.beginFill(0x00ff99);
        }else if(move_number > 20 && move_number < 31){
            graphics.beginFill(0x66ff33);
        }else if(move_number > 30 && move_number < 41){
            graphics.beginFill(0xff9933);
        }else if(move_number > 40 && move_number < 64){
            graphics.beginFill(0xcc0000);
        }

        graphics.lineStyle(1, 0x000000, 1);
        graphics.drawRect(x, y, 64, 64);
        //Draw some text with the coordinates.


        game.world.moveDown(graphics);


    };

    var drawText = function(x,y){

        var style = {font: "12px Arial", fill: "#000000", align:"center"};

        var text = game.add.text( x + 32, y +32, "(x, y):" +"( " +gridX + "," + gridY + " )" + "\n" + " Move: " + working_path.length, style);

        text.anchor.set(.5);
        game.world.moveDown(text);

    };



    var update = function(){

        var posX = Math.floor(knight.body.position.x),
            posY = Math.floor(knight.body.position.y);

        /**
        if(posX == destinationX  && posY == destinationY){
            //We should scan and grab an identifier
            knight.body.position.x = posX;
            knight.body.position.y = posY;

            //Now that we are here, we choose a different position and move
            var chosen = scan(gridX, gridY);

            gridX = chosen[0];
            gridY = chosen[1];
            destinationX = squares[gridX][gridY].x;
            destinationY = squares[gridX][gridY].y;

            knight.body.moves = true;
            var tweenKnight = game.add.tween(knight);
            tweenKnight.to({x:destinationX, y:destinationY}, 1000, Phaser.Easing.Linear.None);

        }
         **/




    };

    var render = function(){

        for(var i=0; i<squares.length; i++){
            for(var j=0; j<squares[i].length; j++){

                (squares[i][j].marked) ? game.debug.geom(squares[0][0].shape, "#00ff00") : '' ;

            }


        }




    };

    var scan = function(i , j){

        //Every few seconds, we scan for an open position. This always follows the general formula.
        //There are eight positions to check for.
        var main_matrix = math.matrix([i,j]),
            available_matrix = [];
        //This is our main transformation matrices
        //These represent our directional matrices.
       /** var transforms =[
             math.matrix([[2,0], [0,1]]),
             math.matrix([[1,0], [0,2]]),
             math.matrix([[-2,0], [0,1]]),
             math.matrix([[-1,0], [0,2]]),
             math.matrix([[2,0], [0,-1]]),
             math.matrix([[1,0], [0,-2]]),
             math.matrix([[-2,0], [0,-1]]),
             math.matrix([[-1,0], [0,-2]])
            ];
        **/

        var transforms =[

            math.matrix([2,1]),
            math.matrix([1,2]),
            math.matrix([-2,1]),
            math.matrix([-1,2]),
            math.matrix([2, -1]),
            math.matrix([1,-2]),
            math.matrix([-2,-1]),
            math.matrix([-1,-2])

        ];

        //To calculate which positions are available, we take our i and j values and compare them.

        for(var d=0; d<transforms.length; d++){

            var result = math.add(transforms[d], main_matrix),

                xIndex = math.subset(result, math.index(0)),
                yIndex = math.subset(result, math.index(1));

            if(position_exists(xIndex, yIndex)){

                var marked = squares[xIndex][yIndex].marked;

                if(!marked) {

                    result = math.matrix([xIndex, yIndex]);

                    available_matrix.push(result);
                }
            }


        }

        //Choose the smallest value available. Or, that value that has the least size m x n.
        /**
        var chosen =[];
        //To choose this, we do as follows.

        for(var c = 0; c < available_matrix.length; c++){

            var m = available_matrix[c],
                xIndex = math.subset(m, math.index(0)),
                yIndex = math.subset(m, math.index(1));

            if(c ==0){
                chosen.push(xIndex);
                chosen.push(yIndex);
                continue;
            }

            //This logic needs to change.

            if(xIndex < chosen[0] || yIndex < chosen[1]){

                chosen[0] = xIndex;
                chosen[1] = yIndex;

            }

        }
        squares[chosen[0]][chosen[1]].marked = true;
        gridX = chosen[0];
        gridY = chosen[1];
        return chosen;
        **/
        return available_matrix;

    };

    var look_ahead  = function(start, arr){
        var scanned =[],
            shortest_length,
            chosen_index;

        for(var i=0; i<arr.length; i++){

            var m = arr[i],
            xIndex = math.subset(m, math.index(0)),
            yIndex = math.subset(m, math.index(1));

            var depth = scan(xIndex, yIndex);

            if(i ==0){
                shortest_length = depth.length;
                chosen_index = i;
            }else if(depth.length < shortest_length){
                chosen_index = i;
                shortest_length = depth.length;

            }


        }

        var chosen = [math.subset(arr[chosen_index], math.index(0)), math.subset(arr[chosen_index], math.index(1))];
        squares[chosen[0]][chosen[1]].marked = true;

        working_path.push(chosen);

        return chosen;

    };

    //Our algorithm will work by scanning every few moments and then
    //moving after that set amount of time to a new location.


    var position_exists = function(xIndex, yIndex){

        return (xIndex < 8 && xIndex >= 0 && yIndex < 8 && yIndex >= 0);

    };


    //We use a variation of the groupSum problem.
    var evaluatePath = function(start, path){

        if(start >= squares.length) return (path == 0);

        var value =scan(i, j);

        if(evaluatePath(index + 1, path - 1)) return true;

        return !!evaluatePath(index + 1, available, path);

    };

    var evaluate_path_2 = function(){







    };



    return {

        init: init


    }




})();

Engine.init(800,700);


