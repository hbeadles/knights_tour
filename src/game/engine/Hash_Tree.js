/**
 * Created by hbeadles on 12/19/2016.
 */



var MoveHashTree = (function(){

    var values,
        N,
        size;



        var init = function(s){
            values ={};
            N =0;
            size = s;



        };



    var calculateHash = function(key){

        return key.toString().length % size;

    };
    var search = function(key) {
        const hash = calculateHash(key);
        if(values.hasOwnProperty(hash) && values[hash].hasOwnProperty(key)) {
            return values[hash][key];
        } else {
            return null;
        }
    };

    var length = function() {
        return N;
    };

    var print = function() {
        var string = '';
        for(var value in values) {
            for(var key in values[value]) {
                string += '' + "X: " + values[value][key][0].x +  " Y: " + values[value][key][0].y + "\n";
            }
        }
        console.log(string);
    };

    var add = function(key, val){
        const hash = calculateHash(key);
        if(!values.hasOwnProperty(hash)) {
            values[hash] = {};
        }
        if(!values[hash].hasOwnProperty(key)) {
            N++;
        }
        values[hash][key] = val;
    };





    var remove = function(key){
        const hash = calculateHash(key);
        if(values.hasOwnProperty(hash) && values[hash].hasOwnProperty(key)) {
            delete values[hash][key];
            N--;
        }




    };

    return {

        init: init,
        add: add,
        remove: remove,
        print: print,
        search: search,
        length: length


    };


});

var hashTree = MoveHashTree();



function Grid (x, y){

    this.x = x;
    this.y = y;

};

Grid.prototype.toString = function gridToString(){

  return 'X: ' + this.x + " Y : " + this.y;

};


hashTree.init(3);
hashTree.add(new Grid(1, 1), [{x: 43, y: 44}]);
hashTree.add(new Grid(1, 2), [{x: 23, y: 55}]);
hashTree.print();
