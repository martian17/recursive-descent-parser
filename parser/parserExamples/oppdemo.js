//require ../opp.js


var parser = new GenParser(
    [
        [
            [1,0,"+"],
            [1,0,"?"],
            [1,0,"*"]
        ],
        [2,0,"-"],
        [2,1,"&"],
        [2,1,"|"],
        [2,0,"="],
        [4,0,"\n"],
        [3,0,"(",")"]
    ]
);

var lex = function(str){
    var a = str.split(" ");
    var b = [];
    for(var i = 0; i < a.length; i++){
        if(["+","?","*","-","&","|","=","\n","(",")"].includes(a[i])){
            b.push(["op",a[i]]);
        }else{
            b.push(["id",a[i]]);
        }
    }
    return b;
};


var result = parser.parse(lex("block = \"{\" & ( dataname & \":\" & data * ) * & \"}\""));
var result = parser.parseOrdered(lex("block = \"{\" & ( dataname & \":\" & data * ) * & \"}\""));
//var result = parser.parseOrdered(lex("block = ( dataname )"));
console.log(result);
displayTree(result);

