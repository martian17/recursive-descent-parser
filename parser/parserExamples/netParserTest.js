//require ../recursiveDescentParser.js


var parser = new RecursiveDescentParser(`

page =  S* & [clause*]
clause = [variablename & S+ & variablename & S* & block] & S*

block = "{" & S* & [dataset*] & S* & "}"
dataset = [variablename & S* & ":" & S* & datasetContent*] & S*
datasetContent =



variablename = ('(A|"_")&(A|N|"_")*') # ('')turn it into string

A = "a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|"n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"
N = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"0"
INT = ('N+')
S = " "|"\n"|"\t"|"\r"
# A, N and ALL are pre-defined
`);


var result = parser.parse(`

simple TxcRocketfuel
{
gates:
gate;
}

network backbone_latencies_1221
{
submodules:
TxcRocketfuel;
TxcRocketfuel;
connections:
BrisbaneInAustralia1800;
BrisbaneInAustralia1769;
}


`);

console.log(result);








