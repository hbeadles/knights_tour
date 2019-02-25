/**
 * Created by hbeadles on 12/16/2016.
 *
 * A Binary Search Tree that helps us navigate and construct a movement tree
 * for the Knight's Tour.
 */


var kMoveCalc = (function(){


    var root;


    var init = function(){

    };


    var is_empty = function(){


    };

    var size = function(){
      return size_sub(root);

    };

    var clear = function(){

        root = null;

    };

    var size_sub = function(x){
        if( x == null || x == undefined) return 0;
        return x.size;
    };

    var contains_coords = function(x, y){
      if(x == null || y == null) throw new EventException("Coordinates cannot be null");

       return (get(x,y) != null);

    };

    var get = function(x,y){

        return get_key(root, x, y, depth_level);

    };
    //Search for the key given the depth_level
    var get_key = function (node, x, y, start, depth){
        if( node == null) return null;

        //Couldn't find it.
        if(start >= depth) return null;

        for(var i=0; i<node.children.length; i++) {
            //Each child, we check the following.
            //Does the depth match?
            if (depth == node.children[i].depth) {

                if (x == node.children[i].x && y == node.children[i].y) {

                    return {
                        parent: node,
                        x: node.children[i].x,
                        y: node.children[i].y,
                        destX: node.children[i].destX,
                        destY: node.children[i].destY
                    };
                }


            }
        }
            //Now we search the next level for each element on the list.
            //n^2 performance.

            for(i =0; i<node.children.length; i++){

                get_key(node.children[i], x, y,start + 1,  depth)

            }




    };

    var put = function (x, y, key, destX, destY, depth, marked){
      //Insert in the root at this layer of depth
      root = put_key(root, x, y, key,destX, destY,depth, marked);

    };

    /**
     * x: x grid location
     * y: y grid location
     * destX: pixelX location
     * destY: pixelY location
     * children: an array of children
     * rand: random key. This distinguishes sub roots.
     * size: 1
     *
     * @param node
     * @param x
     * @param y
     * @param destX
     * @param destY
     * @returns {*}
     */
    var put_key = function(node, x, y, key,destX, destY, marked){

        if(node == null || node == undefined) {
            return {x: x,
                    y: y,
                    destX: destX,
                    destY: destY,
                    children: null,
                    marked: marked,
                    key: random_assign(0, 800000),
                    size: 1};
        }

        if(marked == false && key == node.key){

           if(node.children.isArray()){

               //Add it as a child of the node.


           }
        }

        //Otherwise we need to traverse our list.



    };

    var min = function(){

        return min_key(root);


    };

    var min_key = function(node){

        if (node.right == null) return node;
        else return min_key(node.right);


    };

    var random_assign = function(min, max){

        return Math.random() * (max-min) + min;


    };





    return {

        size: size,
        get: get,
        put: put

    };



});

//Some tests.
calc1 = kMoveCalc();
calc1.put(1,1, 64,64);
calc1.put(2,2, 128, 128);
calc1.put(1,2, 196,196);
var contain = calc1.get(1, 2);
console.log(contain);