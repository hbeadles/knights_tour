/**
 * Created by hbeadles on
 */


var Engine_v2 = (function(){


    var game,
        map,
        background,
        board,
        endButton,
        moveCountButton,
        squares,
        gridX,
        gridY,
        graphics,
        knight,
        moveCount =0,
        width,
        working_path,
        working_path_grid,
        temp_grid,
        temp_moves,
        height,
        startState = false,
        startButton,
        helpButton = false,
        textGroup,
        loadState = false,
        moveState = false,
        aiMoveState = false,
        moveReference;

    var init = function(w, h){

        //Construct a new instance of Game

        width = w;
        height = h;
        moveReference = MoveHashTree(64);
        moveReference.init();
        game = new Phaser.Game(width,height, Phaser.CANVAS, 'content', {preload:preload, create: create, update:update, render:render});


    };

    var preload = function(){

        game.load.image('knight', '../assets/img/horse.png', 64, 64);
        game.load.spritesheet("helpButton", "../assets/img/help_button.png",84, 40);
        game.load.tilemap('chess', '../assets/tiled_maps/board.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('dark_piece', '../assets/img/dark_piece.jpg');
        game.load.image('tan_piece', '../assets/img/tan_piece.jpg');
        game.load.spritesheet("startButton", "../assets/img/start_button.png", 152, 40);
        game.load.spritesheet("moveButton", "../assets/img/move_button.png",161, 40);
        game.load.spritesheet("endButton", "../assets/img/end_button.png", 141, 40);

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
                var gridTest = new Grid(i, j);
                //Do a depth search and find the possible moves.
                var collect = sub_search(i, j);
                //We add the reference to our hash tree.
                moveReference.add(gridTest, collect);
                //Increment the height
                xStart += 64;
            }
            xStart = 128;
            yStart += 64;

        }

        return innerSquares;

    };


    var create = function() {
        working_path = [];
        temp_moves =[];
        temp_grid =game.add.group();
        working_path_grid = game.add.group();
        graphics = game.add.graphics(0, 0);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, width, height);
        //Load in our board
        game.stage.backgroundColor = "#ececec";

        map = game.add.tilemap('chess');
        map.addTilesetImage('tan_piece', 'tan_piece');
        map.addTilesetImage('dark_piece', "dark_piece");

        background = map.createLayer('background');
        background.resizeWorld();
        var style = {font: "bold 32px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"};
        var style_2 = {font: "italic 14px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"};
        var text = game.add.text(0, 0, "The Knights Tour", style);
         game.add.text(game.world.centerX - 125, 100, "Can you solve the tour and cover the board?", style_2);
        text.setTextBounds(0, 50, 800, 100);


        squares = calculatePositions();
        //This helps us know where to move the knight based on our grid.

        //It also constructs a hash table with references for every spot on the grid.

        game.input.mouse.capture = true;

        textGroup = game.add.group();


        //We add a few buttons to start and stop the game.
         startButton = game.add.button(game.world.centerX - 90, 650, 'startButton', startGame, this, 1, 2, 1);

       // startButton.onInputOver.add(function(){console.log("Input Over")}, this);
        //startButton.onInputOut.add(function(){console.log("Input Out")}, this);



    };

    var get_position = function(x, y){


        for(var i=0; i<squares.length; i++){

            for(var j =0; j<squares[i].length; j++){

                var xStart = squares[i][j].x,
                    yStart = squares[i][j].y;


                if(x < (xStart + 64) && y < (yStart + 64) &&
                        x >= (xStart) && y >= (yStart) ){


                    //Place the knight
                    knight.destroy();
                    knight = game.add.sprite(xStart, yStart, 'knight');
                    game.physics.enable(knight, Phaser.Physics.ARCADE);

                    startState = false;
                    loadState = true;
                    gridX = i;
                    gridY = j;
                    moveCount =1;

                    var rect = drawRect(xStart, yStart, 0xff0000, moveCount);
                    working_path_grid.add(rect);

                    //I add this spot to my working_path collection
                    working_path.push({x: xStart, y: yStart, gridX: i, gridY: j});
                    //I mark the position as used. That way I can't go back to it.
                    squares[i][j].marked = true;
                    break;
                }


            }

        }




    };

    /**
     * Using the current moves, find if the user has selected the correct place.
     *
     * @param container. An array of objects.
     * @param x
     * @param y
     */
    var determine_move = function(container, x, y){


        //This object needs to be looped through. Has a contract with a x and y parameter.

        for(var i=0; i<container.length; i++){

            var obj = container[i],
                gX = obj.x,
                gY = obj.y;

            //This represents our moves.
            //These are the grid positions.
            var realX = squares[gX][gY].x,
                realY = squares[gX][gY].y,
                marked = squares[gX][gY].marked;

            if(x < (realX + 64) && y < (realY + 64) &&
                x >= (realX) && y >= (realY) && !marked){

                //Clear the board of graphics and text objects.
                //Rebuild them

                temp_grid.removeAll(true);
                textGroup.removeAll(true);
                working_path_grid.removeAll(true);

                temp_moves =[];
                graphics = game.add.graphics(0, 0);

                //Working path will have to be drawn in every time this runs.
                moveCount++;
                var rect = drawRect(realX, realY, "0xff0000", moveCount);

                //Mark our grid.
                squares[gX][gY].marked = true;

                working_path_grid.add(rect);
                gridX = gX;
                gridY= gY;

                //Freaking love tweens!
                //Tween the knight to that position.
                var tweenKnight = game.add.tween(knight);
                tweenKnight.to({x:realX, y:realY}, 500, Phaser.Easing.Linear.None);
                tweenKnight.start();

                //I add this spot to my working_path collection
                working_path.push({x: realX, y: realY, gridX: gridX, gridY: gridY});
                //I mark the position as used. That way I can't go back to it.
                squares[gridX][gridY].marked = true;

                break;
            }





        }




    };

    var update = function(){


        if(startState && typeof knight != 'undefined' &&  knight != null){


            //We seek to have the knight follow the mouse cursor. That way it can be placed on the board.
            game.physics.arcade.moveToXY(knight, game.input.mousePointer.x, game.input.mousePointer.y, 500, 100);

            //This is just a simulation. I base my actual input based on the mouseClick

            if(game.input.activePointer.leftButton.isDown){

                //Go through each of the squares and determine where to place the knight
                get_position(game.input.mousePointer.x, game.input.mousePointer.y);


            }
        }

        //Once my loadstate activates, The character is placed. We generate squares that indicate where to go.

        if( loadState ){

            //Instruct the player to move.
            //Highlight the places the player can move to, and label each one.
            loadEvaluate();



        }

        if( moveState ){

            //Once this activates, we choose where to go.
            if(!helpButton){

                //Construct the help button and place it on the board.
                helpButton = game.add.button(game.world.centerX - 50, 700, 'helpButton', aiMove, this, 1, 2, 1);
                moveCountButton = game.add.button(game.world.centerX - 220, 700, 'moveButton', moveCountCheck, this, 1, 2, 1);
                endButton = game.add.button(game.world.centerX + 40, 700, 'endButton', endGame, this, 1, 2, 1);

            }

            if(game.input.activePointer.leftButton.isDown){
                determine_move(temp_moves, game.input.mousePointer.x, game.input.mousePointer.y);
                loadEvaluate();
                rebuild_path();
                rebalance();

            }


            if(working_path.length >= 63){

                //Kill the move state, move on to the next state.

            }



        }



    };

    var aiMove = function(){

        moveState = false;
        //In this case, our ai moves.
        //In our case, we just evaluate where to go next.
        //Our evaluation is based upon the length of the next moves.
        //
        var real = evaluate(gridX, gridY);
        determine_move(temp_moves, real.x, real.y);
        loadEvaluate();
        rebuild_path();
        rebalance();

        setTimeout(function(){
            moveState = true;
        }, 500);



    };

    var moveCountCheck = function(){

        //How do we flash the correct rects?






    };


    var clearBoard = function(){

        knight.destroy();
        endButton.destroy();
        moveCountButton.destroy();
            gridX =0,
            gridY =0,
                moveCount =0,
            working_path = [],
            working_path_grid.removeAll(true),
            temp_grid.removeAll(true),
            temp_moves =[],
            startState = false,
            helpButton.destroy(),
            helpButton = null;
            textGroup.removeAll(),
            loadState = false,
            moveState = false,
            aiMoveState = false,


            squares = calculatePositions();

        startButton.inputEnabled = true;


    };


    var endGame = function(){

        clearBoard();

    };




    var drawRect = function(x, y, hexColor, optText){
        graphics.beginFill(hexColor);
        graphics.lineStyle(1, 0x000000, 1);
        var rect =graphics.drawRect(x, y, 64, 64);
        //Draw some text with the coordinates.

        //We'll add in optional text
        if(typeof optText != "undefined" && optText != null){

            var style_small = {font: "bold 24px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "bottom"};

            var text = game.add.text(x + 25, y + 16, optText, style_small);

            textGroup.add(text);


            rect.text = text;


        }
        return rect;




    };

    var rebuild_path = function(){


        for(var i=0; i<working_path.length; i++){

           var rect = drawRect(working_path[i].x, working_path[i].y,"0xff0000", i +1);
            working_path_grid.add(rect);

        }


    };





    var loadEvaluate = function(){
        var moves = moveReference.search(new Grid(gridX, gridY)),
            count = 1;

        //These are our allowed moves at the current moment.
        temp_moves = moves;

        //This gives me my available moves on the board, positioned as an array.
        for(var i=0; i<moves.length; i++){

            //For each of the positions, we need to construct a graphic
            var tempX = moves[i].x,
                tempY = moves[i].y;


            //Get me the destination coordinates.
            if(!squares[tempX][tempY].marked) {
                var destinationX = squares[tempX][tempY].x,
                    destinationY = squares[tempX][tempY].y;

                //I have the actual position of the grid square.

                var rect = drawRect(destinationX, destinationY, "0x00ff00", count);

                //Store our rects for future reference.
                temp_grid.add(rect);

                ++count;
            }


        }

        loadState = false;

        moveState = true;
        //We construct our turn state
        rebalance();


    };

    var rebalance = function(){

        //Sprites top, text second, graphics last.

        game.world.bringToTop(working_path_grid);
        game.world.bringToTop(temp_grid);
        game.world.bringToTop(textGroup);
        game.world.bringToTop(knight);



    };
    var render = function(){




    };

    var startGame = function(){

        console.log("Game Started");
        //Ok, here we attach an image to the cursor.
        startState = true;
        //load in the knight and place it at the x and y position of the mouse cursor.
        knight = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'knight');
        game.physics.enable(knight, Phaser.Physics.ARCADE);
        //Disable the input button now.
        startButton.inputEnabled = false;

    };



    var position_exists = function(xIndex, yIndex){

        return (xIndex < 8 && xIndex >= 0 && yIndex < 8 && yIndex >= 0);

    };

    var sub_search = function(x, y) {

        var main_matrix = math.matrix([x, y]);
        var collection =[];

        //These comprise transformations over the x, y axes
        var transforms = [

            math.matrix([2, 1]),
            math.matrix([1, 2]),
            math.matrix([-2, 1]),
            math.matrix([-1, 2]),
            math.matrix([2, -1]),
            math.matrix([1, -2]),
            math.matrix([-2, -1]),
            math.matrix([-1, -2])

        ];


        for (var d = 0; d < transforms.length; d++) {

            var result = math.add(transforms[d], main_matrix),
                xIndex = math.subset(result, math.index(0)),
                yIndex = math.subset(result, math.index(1));

            if (position_exists(xIndex, yIndex)) {

                    result = math.matrix([xIndex, yIndex]);
                    var collect = {x: math.subset(result, math.index(0)), y: math.subset(result, math.index(1))};
                    collection.push(collect);

            }

        }

        return collection;



    };

    /**
     * Given a coordinate x and y, evaluate the next point on the path for the ai.
     * Using Warnsdoff's Rules, which applies three different applicants:
     * 1. The n+1 square is adjacent to the nth square (meaning it can be moved to)
     * 2. is unvisited
     * 3. has the minimal number of unvisited, adjacent squares.
     *
     * @param x
     * @param y
     */
    var evaluate = function(x, y){

        var collect = moveReference.search(new Grid(x, y)),
            lowest,
            choice_lowest,
            found = false;

        //All we do is just choose the one with
        //the lowest turns.
        for(var i=0; i<collect.length; i++){
            //Each collect is an grid value.
            //We achieve step 1 using the marked keyword.
            var gX = collect[i].x,
                gY = collect[i].y,
                marked = squares[gX][gY].marked,
                gValue = moveReference.search(new Grid(gX, gY)),
                subContain =[];
                //We need to screen the values of gValue in order to ensure that
                //we only have those that are marked.
                console.log(gValue);
                console.log(marked);

                //Loop through gValues.
                if(!marked){

                    for(var j=0; j<gValue.length; j++){

                        var gSubX = gValue[j].x,
                            gSubY = gValue[j].y,
                            g_marked = squares[gSubX][gSubY].marked;

                        (!g_marked) ? subContain.push({x: gSubX, y: gSubY}) : '';
                    }

                }

                var gLength = subContain.length;
                var realX = squares[gX][gY].x;
                var realY = squares[gX][gY].y;
                //Find the first element that's not marked.


            if(!marked && !found){
                found = true;
                lowest =gLength;

                choice_lowest = {x:realX, y: realY};

            }else if(!marked && found){

                if(gLength == lowest){
                    //Randomly choose either this point or our current one.
                    var choice = getRandomInclusive(0,1);
                    if(choice ==0){
                        gLength = lowest;
                        choice_lowest ={x: realX, y: realY};
                    }
                }else if(gLength < lowest){
                    lowest = gLength;
                    choice_lowest = {x: realX, y: realY};
                }
            }else{
                //Is the length greater an 63?


            }

        }

        return choice_lowest;


    };

    var getRandomInclusive = function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;

    }


    return {

      init: init

    };







})();

Engine_v2.init(800,800);