//require displaytree.js

var Stack = function(){
    var stack = null;
    this.peek = function(){
        if(stack === null){
            return null;
        }
        return stack[0];
    };
    this.push = function(item){
        stack = [item,stack];
    };
    this.pop = function(){
        if(stack === null){
            return null;
        }
        var retval = stack[0];
        stack = stack[1];
        return retval;
    };
    this.display = function(){
        var a = [];
        var ts = stack;
        while(ts !== null){
            a.push(ts[0]);
            ts = ts[1]
        }
        return a;
    }
};

var encodeTwoTokens = function(a,b){
    var aa = "";
    var bb = "";
    for(var i = 0; i < a.length; i++){
        if(a[i] === "|"){
            aa += "||";
        }else if(a[i] === ","){
            aa += "|,";
        }else{
            aa += a[i];
        }
    }
    for(var i = 0; i < b.length; i++){
        if(b[i] === "|"){
            bb += "||";
        }else if(b[i] === ","){
            bb += "|,";
        }else{
            bb += b[i];
        }
    }
    return aa + "," + bb;
};

var decodeTwoTokens = function(str){
    var a;
    var b;
    var ab = "";
    for(var i = 0; i < str.length; i++){
        if(str[i] === "|"){
            ab += str[i+1];
            i++;
        }else if(str[i] === ","){
            a = ab;
            ab = "";
        }else{
            ab += str[i];
        }
    }
    b = ab;
    return [a,b];
};

var GenParser = function(precedence){
    var stackPs = [
        {},//class 0 !
        {},//class 1 ++
        {},//class 2 *
        {},//class 3 ()
        //{},//class 4 \n
    ];
    var feedPs = {};
    var procLen = precedence.length;
    var lowProc0 = 3*0;//used by $
    var lowProc1 = 3*1;//used by (,) class 3
    var lowProc2 = 3*2;//used by ? ++ class 0 and 3
    var highProc = 3*(3+procLen);//used by class 1

    feedPs["$"] = lowProc0;

    //putting values to the reference table
    for(var i = 0; i < precedence.length; i++){//from lower to higher
        var basePrec = 3*(3+(precedence.length-i-1));
        var rs = [precedence[i]]
        if(Array.isArray(precedence[i][0])){//if group
            rs = precedence[i];
        }
        for(var j = 0; j < rs.length; j++){//for each entry
            var r = rs[j];
            var rclass = r[0];
            var rassociativity = r[1];
            var rstr1 = r[2];
            var rstr2 = r[3];
            if(rclass === 0){
                stackPs[0][rstr1] = basePrec;
                feedPs[rstr1] = basePrec - 1;
            }else if(rclass === 1){
                stackPs[1][rstr1] = highProc;
                feedPs[rstr1] = basePrec - 1;
            }else if(rclass === 2){
                stackPs[2][rstr1] = basePrec;
                feedPs[rstr1] = basePrec + (rassociativity===0?-1:1);
            }else if(rclass === 3){
                stackPs[0][rstr1] = lowProc1;
                feedPs[rstr1] = highProc;
                stackPs[1][rstr2] = lowProc1;
                feedPs[rstr2] = lowProc2;
                stackPs[3][encodeTwoTokens(rstr1,rstr2)] = highProc;
            }
        }
    }

    //console.log(stackPs);
    //console.log(feedPs);


    var cleanupAST = function(ast){
        return cleanupASTK(ast,true);
    };

    var cleanupASTK = function(ast,f){
        if(f){
            if(Array.isArray(ast[1])){//nested
                return cleanupASTK(ast[1],false);
            }else{//true id
                return ast;
            }
        }else{//inside group
            for(var i = 1; i < ast.length; i++){
                ast[i] = cleanupASTK(ast[i],true);
            }
            return ast;
        }
    };



    this.parse = function(tokens){
        tokens.push(["$","$"]);
        var stack = new Stack();
        stack.push(["$","$"]);
        stack.push(["$","$"]);
        stack.push(tokens[0]);

        var i = 1;
        var cnt = 0;
        while(i < tokens.length+1){
            cnt++;
            if(cnt > 1000){
                console.log("timeout, unaccepted");
                break;
            }


            var lookahead = tokens[i];
            var t3 = stack.pop();
            var t2 = stack.pop();
            var t1 = stack.pop();

            //end condition
            if(t1[0] === "$" && t3[0] === "$"){
                stack.push(t1);
                stack.push(t2);
                stack.push(t3);
                return cleanupAST(t2);
                //if does not accept returns undefined
            }

            //reduce
            if(t1[0]==="id"&&t2[0]==="op"&&t3[0]==="id"&&stackPs[2][t2[1]]){//class 2
                //class 2
                var p1 = stackPs[2][t2[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(["id",[t2[1],t1,t3]]);
                    continue;
                }
            }
            if(t1[0]==="op"&&t2[0]==="id"&&t3[0]==="op"&&stackPs[3][encodeTwoTokens(t1[1],t3[1])]){//class 3
                //class 3
                var p1 = stackPs[3][encodeTwoTokens(t1[1],t3[1])];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(["id",[t1[1],t2]]);
                    continue;
                }
            }
            if(t2[0]==="op"&&t3[0]==="id"&&stackPs[0][t2[1]]){//class 0
                //class 0
                var p1 = stackPs[0][t2[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(t1);
                    stack.push(["id",[t2[1],t3]]);
                    continue;
                }
            }
            if(t2[0]==="id"&&t3[0]==="op"&&stackPs[1][t3[1]]){//class 1
                //class 1
                var p1 = stackPs[1][t3[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(t1);
                    stack.push(["id",[t3[1],t2]]);
                    continue;
                }
            }
            //shift
            stack.push(t1);
            stack.push(t2);
            stack.push(t3);
            stack.push(lookahead);
            i++;
        }
    };


    this.parseOrdered = function(tokens){
        tokens.push(["$","$"]);
        var stack = new Stack();
        stack.push(["$","$"]);
        stack.push(["$","$"]);
        stack.push(tokens[0]);

        var i = 1;
        var cnt = 0;
        while(i < tokens.length+1){
            cnt++;
            if(cnt > 100){
                console.log("timeout, unaccepted");
                break;
            }


            var lookahead = tokens[i];
            var t3 = stack.pop();
            var t2 = stack.pop();
            var t1 = stack.pop();

            //end condition
            if(t1[0] === "$" && t3[0] === "$"){
                stack.push(t1);
                stack.push(t2);
                stack.push(t3);
                return t2;
                //if does not accept returns undefined
            }

            //reduce
            if(t1[0]==="id"&&t2[0]==="op"&&t3[0]==="id"&&stackPs[2][t2[1]]){//class 2
                //class 2
                var p1 = stackPs[2][t2[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(["id",[t1,t2,t3]]);
                    continue;
                }
            }
            if(t1[0]==="op"&&t2[0]==="id"&&t3[0]==="op"&&stackPs[3][encodeTwoTokens(t1[1],t3[1])]){//class 3
                //class 3
                var p1 = stackPs[3][encodeTwoTokens(t1[1],t3[1])];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(["id",[t1,t2,t3]]);
                    continue;
                }
            }
            if(t2[0]==="op"&&t3[0]==="id"&&stackPs[0][t2[1]]){//class 0
                //class 0
                var p1 = stackPs[0][t2[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(t1);
                    stack.push(["id",[t2,t3]]);
                    continue;
                }
            }
            if(t2[0]==="id"&&t3[0]==="op"&&stackPs[1][t3[1]]){//class 1
                //class 1
                var p1 = stackPs[1][t3[1]];
                var p2 = feedPs[lookahead[1]];
                if(p1>p2){//reduce
                    stack.push(t1);
                    stack.push(["id",[t2,t3]]);
                    continue;
                }
            }
            //shift
            stack.push(t1);
            stack.push(t2);
            stack.push(t3);
            stack.push(lookahead);
            i++;
        }
    };
};

/*
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

*/







