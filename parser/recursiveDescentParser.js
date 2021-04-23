//require ebnfparser.js




/*
different kinds of AST nodes
name
array
root
rule
empty
*/

var RecursiveDescentParser = function(grammar){
    var grammar = parseEBNF(grammar);
    var rules = {};
    for(var i = 0; i < grammar.length; i++){
        var line = grammar[i];
        if(line[0] !== "="){
            console.log("grammar contains lines which is not assignment");
            return false;
        }
        rules[line[1][1]] = line[2];
    }
    var root = rules[grammar[0][1][1]];

    console.log(root);

    var strAt = function(strf,i,str){
        for(var j = 0; j < str.length;j++){
            if(str[j] !== strf[i+j]){
                return false;
            }
        }
        return true;
    };

    var astToString = function(ast){
        if(Array.isArray(ast)){
            var str = "";
            for(var i = 0; i < ast.length; i++){
                str+=astToString(ast[i]);
            }
            return str;
        }else if(typeof ast === "string"){
            return ast;
        }else{
            return "";
        }
    };

    var cleanupAST = function(ast){//ast must be a "rule" node
        var root = ast[1];
        var itrRule = function(sast){//just for finding the root
            //console.log(sast);
            if(sast[0] === "root"){
                root = sast[1];
                return true;
            }else if(sast[0] === "rule"){
                return false;
            }else if(sast[0] === "array"){
                for(var i = 0; i < sast[1].length; i++){
                    itrRule(sast[1][i]);
                }
            }else if(sast[0] === "name"){
                console.log("nested naming outside root not permitted");
                return false;
            }else if(sast[0] === "stringConversion"){
                itrRule(sast[1]);
            }else{
                return false;//dead branch
            }
        };
        itrRule(ast[1]);
        //console.log(root);
        var itrRoot = function(sast){//iterating inside the root to invoke other rules
            if(sast[0] === "root"){
                console.log("nested root not permitted in a rule");
                return false;
            }else if(sast[0] === "rule"){
                return cleanupAST(sast);//invoke cleanup in the branch
            }else if(sast[0] === "array"){//go down
                for(var i = 0; i < sast[1].length; i++){
                    sast[1][i] = itrRoot(sast[1][i]);
                }
                return sast[1];
            }else if(sast[0] === "name"){//go down
                return [sast[1],itrRoot(sast[2])];
            }else if(sast[0] === "stringConversion"){
                var result = itrRoot(sast[1]);
                //convert result into string and return
                return astToString(result);
            }else if(sast[0] === "empty"){//terminal
                return sast;
            }else if(typeof sast === "string"){//terminal
                return sast;
            }
        };
        return itrRoot(root);
    };

    this.parse = function(str){
        var i = 0;
        var exrule = function(str,rule){
            //console.log(str,rule);
            if(rule[0] === "name"){
                //jump to another rule
                var result = exrule(str,rules[rule[1]]);
                if(result)return ["rule",result];
                return false;
            }else if(rule[0] === "str"){
                //string terminal
                var match = rule[1];
                if(strAt(str,i,rule[1])){//if the string at i is in rule
                    i+= rule[1].length;
                    return rule[1];
                }
                return false;
            }else{
                //jump to another subrule
                return procs[rule[0]](str,rule);
            }
        };
        var procs = {
            "+":function(str,rule){//[+, r1]//returns array
                var result = exrule(str,rule[1]);
                if(!result){//fail
                    return false;
                }
                var ret = [];
                while(result){
                    ret.push(result);
                    result = exrule(str,rule[1]);
                }
                return ["array",ret];
            },
            "?":function(str,rule){//returns ast
                var result = exrule(str,rule[1]);
                if(!result){//fail
                    return ["empty"];
                }
                return result;
            },
            "*":function(str,rule){//returns array
                var result = exrule(str,rule[1]);
                var ret = [];
                while(result){
                    ret.push(result);
                    result = exrule(str,rule[1]);
                }
                return ["array",ret];
            },
            "-":function(str,rule){

            },
            "&":function(str,rule){//returns array
                //(right (associative))
                var i0 = i;
                var result1 = exrule(str,rule[1]);
                if(!result1){
                    i = i0;
                    return false;
                }
                var result2 = exrule(str,rule[2]);
                if(!result2){
                    i = i0;
                    return false;
                }

                if(rule[2][0] === "&"){//returns array
                    //if immediately next to is the same
                    //result2 is "array"
                    result2[1].unshift(result1)
                    return result2;
                }
                return ["array",[result1,result2]];
            },
            "|":function(str,rule){//returns ast
                var result1 = exrule(str,rule[1]);
                if(result1){
                    return result1;
                }
                var result2 = exrule(str,rule[2]);
                if(result2){
                    return result2;
                }
                return false;
            },
            "{":function(str,rule){//returns ast
                if(rule[1][0] === "}"){//if naming node
                    //["{",[",",rule,["name",name]]]
                    var result = exrule(str,rule[1][1]);
                    var name = rule[1][2][1];
                    if(!result){
                        return false;
                    }
                    return ["name",name,result];
                }else{
                    console.log("error");
                    console.log("in name declaration, } inside {; was expected");
                    return false;
                }
            },
            "[":function(str,rule){//returns ast, AKA root
                var result = exrule(str,rule[1]);
                if(!result){
                    return false;
                }
                return ["root",result];
            },
            "('":function(str,rule){//returns ast, string conversion
                var result = exrule(str,rule[1]);
                if(!result){
                    return false;
                }
                return ["stringConversion",result];
            }
        };
        return cleanupAST(["rule",exrule(str,root)]);
    }
};


/*
var parser = new RecursiveDescentParser(`

a = "[" & (((n&",")|(n))*) &"]"
n = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"
`);
var testParser = new RecursiveDescentParserS(`

a = "[" & {el*,(array)} &"]"
a = {{"[",(leftbrace)} & {el*,(array)} &{"]",(rightbrace)},(arr)}
# collects braces and makes an array
# returns [["leftbrace","["],["array",["1","2","3","4"]],["rightbrace","]"]
el = ({n}&",")|({n})
n = {"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}
`);
var result = parser.parse("[3,5,8,2,3,5,2]");
console.log(result);
*/

/*
var parser = new RecursiveDescentParser(`
# change {,} into {}(); in the near future
a = "[" & [{el*}(array);] &"]"
el = ([n]&",")|([n])
n = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"
`);

var result = parser.parse("[3,5,8,2,3,5,2]");
console.log(result);
*/

