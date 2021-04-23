//require opp.js
//require lexebnf.js

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
        [2,0,"}"],//{,}
        [4,0,"\n"],
        [3,0,"(",")"],
        [3,0,"{",";"],
        [3,0,"[","]"],
        [3,0,"('","')"]
    ]
);



var removeParen = function(ast){
    //console.log(ast);
    if(!Array.isArray(ast[1])){//nested
        return ast;
    }else if(ast[0] === "("){
        return removeParen(ast[1]);
    }else{
        for(var i = 1; i < ast.length; i++){
            ast[i] = removeParen(ast[i]);
        }
        return ast;
    }
};

var parseEBNF = function(str){
    var tokens = lexEBNF(str);
    //console.log(tokens);
    var line = [];
    var lines = [line];
    for(var i = 0; i < tokens.length; i++){
        if(tokens[i][0] === "op" && tokens[i][1] === "\n"){
            line = [];
            lines.push(line);
        }else{
            line.push(tokens[i]);
        }
    }
    console.log(lines);
    lines = lines.
    filter((a)=>{return a.length!==0}).//filtering out empty lines
    map(parser.parse).
    //console.log(lines);
    map(removeParen);

    console.log(lines);

    return lines;
};

