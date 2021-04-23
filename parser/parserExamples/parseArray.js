//require ../recursiveDescentParser.js

var parser = new RecursiveDescentParser(`
# change {,} into {}(); in the near future
a = "[" & [{el*}(array);] &"]"
el = ([n]&",")|([n])
n = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"
`);

var result = parser.parse("[3,5,8,2,3,5,2]");
console.log(result);






