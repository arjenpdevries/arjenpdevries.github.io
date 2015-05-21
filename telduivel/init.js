/* 
 *  Part of Arjen & Twan's Telduivel project
 */

//
// Look & feel: size rectangles, colors, etc.
//

// Size of rectangles making up the triangle
var s = 40;

// Background and foreground colors
var c =  [ 'blue', 'yellow' ];
//var c =  [ 'purple', 'lightblue' ];
var cc = [ c[1], c[0] ];

// Parameters: number of lines (n), "divisor" (d), print digits? (p)
var n = 24;
var d = 0;
var p = true;

//
// Parse URL parameters and overrule defaults if necessary
//
function getParameterByName(name, def) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results == null ? def : 
    parseInt(decodeURIComponent(results[1].replace(/\+/g, " ")));
}
n = getParameterByName('n', n);
d = getParameterByName('d', d);
p = getParameterByName('p', p);
s = getParameterByName('s', s);
