//require ../recursiveDescentParser.js

var parser = new RecursiveDescentParser(`
vars = variablename & ('S+') & variablename & "A"?
variablename = ('A&(A|N)*') # ('')turn it into string
    A = "a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|"n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"
N = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"0"
S = " "|"\n"|"\t"|"\r"
# A, N and ALL are pre-defined
`);


var result = parser.parse(`si12397mple TxcRocketfuel`);

console.log(result);






