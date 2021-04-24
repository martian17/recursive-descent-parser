# recursive-descent-parser

This is a general purpose parser with a custom ebnf language to describe the grammar.

```javascript
const RecursiveDescentParser = require("./recursiveDescentParser.js");

//defining grammar for the parser
var parser = new RecursiveDescentParser(`

# This is a comment
# "this" is a literal
# & is concatenates symbols from left to right
# | is just like in regular expression, returns the first match
# * is just like in regular expression, matches zero or more of the symbol
# () parenthesis clarifies the relationship between symbols (may not be necessary)

a = "[" & (((n&",")|(n))*) &"]"
n = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"


`);

var result = parser.parse("[3,5,8,2,3,5,2]");
console.log(result);

/*
[
  '[',
  [
    [ '3', ',' ],
    [ '5', ',' ],
    [ '8', ',' ],
    [ '2', ',' ],
    [ '3', ',' ],
    [ '5', ',' ],
    '2'
  ],
  ']'
]
*/
```
