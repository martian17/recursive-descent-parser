//require recursiveDescentParser.js

var parser = new RecursiveDescentParser(`

page =  S* & [clause*]
clause = [variablename & S+ & variablename & S* & block] & S*

block = "{" & S* & [dataset*] & S* & "}"
dataset = [variablename & S* & ":" & S* & datasetContent*] & S*
datasetContent = accessStyle | colonStyle | connectionStyle
accessStyle = variablename & S+ & variablename & S* & "[];" & S* #I don't care about this style
colonStyle = [variablename & S* & ":" & S* & variablename] & S* & ";" & S*
connectionStyle = variablename & S* & "." & S* & variablename & S* & "++" & S* & "<-->" & S* & "{" & S* & "delay" & S* & "=" & S* & INT & S* & "ms" & S* & ";" & S* & "}" & S* & "<-->" & S* & variablename & S* & "." & S* & "gate" & S* & "++" & S* & ";" & S*
##connectionStyle = variablename "." variablename "++" "<-->" "{" "delay" "=" INT "ms" ";" "}" "<-->" variablename "." "gate" "++" ";"



variablename = ('(A|"_")&(A|N|"_")*') # ('')turn it into string

A = "a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|"n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"
N = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"0"
INT = ('N+')
S = " "|"\n"|"\t"|"\r"
# A, N and ALL are pre-defined
`);

var parseNed = parser.parse;



/*
simple TxcRocketfuel
{
gates:
inout gate[];
}

network backbone_latencies_1221
{
submodules:
TownsvilleInAustralia4282: TxcRocketfuel;
BrisbaneInAustralia1800: TxcRocketfuel;
connections:
TownsvilleInAustralia4282.gate++ <--> { delay = 700ms; } <--> BrisbaneInAustralia1800.gate++;
TownsvilleInAustralia4282.gate++ <--> { delay = 700ms; } <--> BrisbaneInAustralia1769.gate++;
}
*/







