var isAlphabet = function(str){
    if(str.match(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]/g)){
        return true;
    }
    return false;
};
var isAlphaNum = function(str){
    if(str.match(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890]/g)){
        return true;
    }
    return false;
};





var lexEBNF = function(str){
    var lexInfo = {};
    lexInfo.str = str;
    lexInfo.tokens = [];
    lexInfo.tokenStr = "";
    lexInfo.i = 0;
    lexEBNFKernel(lexInfo);
    return lexInfo.tokens;
};

var lexEBNFKernel = function(lexInfo){
    while(lexInfo.str[lexInfo.i]){
        var chari = lexInfo.str[lexInfo.i];
        var charii = lexInfo.str[lexInfo.i+1]
        if(charii&&(chari+charii==="('"|chari+charii==="')")){//two tokens
            //these tokens are for string conversion parenthesis
            lexInfo.tokens.push(["op",chari+charii]);
            lexInfo.i+=2;
        }else if(chari.match(/[\=\+\*\-\&\|\(\)\[\]\{\}\;\?\n]/g)){
            lexInfo.tokens.push(["op",chari]);
            lexInfo.i++;
        }else if(chari === "\""){
            lexInfo.i++;
            lexString(lexInfo);
        }else if(isAlphabet(chari)){
            lexName(lexInfo);
        }else if(chari === "#"){
            lexComment(lexInfo);
        }else{
            lexInfo.i++;
        }
    }
    return true;
};

var lexString = function(lexInfo){
    lexInfo.tokenStr = "";
    while(lexInfo.str[lexInfo.i]){
        if(lexInfo.str[lexInfo.i] === "\""){
            lexInfo.i++;
            break;
        }else if(lexInfo.str[lexInfo.i] === "\\"){
            lexInfo.i++;
        }
        lexInfo.tokenStr+=lexInfo.str[lexInfo.i];
        lexInfo.i++;
    }
    lexInfo.tokens.push(["id",["str",lexInfo.tokenStr]]);
    //lexInfo.i++;
    return true;
};


var lexName = function(lexInfo){
    lexInfo.tokenStr = "";
    while(lexInfo.str[lexInfo.i]){
        if(!isAlphaNum(lexInfo.str[lexInfo.i])){
            break;
        }
        lexInfo.tokenStr+=lexInfo.str[lexInfo.i];
        lexInfo.i++;
    }
    lexInfo.tokens.push(["id",["name",lexInfo.tokenStr]]);
    return true;
};

var lexComment = function(lexInfo){
    lexInfo.tokenStr = "";
    while(lexInfo.str[lexInfo.i]!=="\n"&&lexInfo.str[lexInfo.i]){
        lexInfo.i++;
    }
    return true;
};