var displayTree = function(ast){
    var canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    var ctx = canvas.getContext("2d");
    ctx.font = "130px Arial";
    ctx.lineWidth = 5;
    document.body.innerHTML = "";
    document.body.appendChild(canvas);
    var lp = 1;
    var iterator = function(ast,depth){
        var slen = 0;
        if(Array.isArray(ast[1])){
            ctx.strokeText(ast[0],lpnow*100,depth*300);
            var lpnow = lp;
            for(var i = 0; i < ast[1].length; i++){
                var sslen = iterator(ast[1][i],depth+1);
                ctx.moveTo(lpnow*100,depth*300);
                ctx.lineTo((lpnow+slen)*100,(depth+1)*300);
                ctx.stroke();
                slen += sslen;
            }
            return slen;
        }else{
            ctx.fillText(ast[1],lp*100-50,depth*300+100);
            lp += ast[1].length;
            return ast[1].length;
        }
    };
    iterator(ast,0.3);
};

