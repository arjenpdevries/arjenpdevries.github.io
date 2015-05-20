/* 
 *  Part of Arjen & Twan's Telduivel project
 */

//
// Move around on the canvas
//

// Set static style properties of the canvas
function initctx(ctx, c) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = c[0];

  // Set text font properties
  ctx.font = '7pt Calibri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Move starting point to top middle
  ctx.translate(canvas.width / 2, s);
}

// Draw a rectangle of size s
function rect(ctx, c) {
  ctx.fillStyle = c[0];
  ctx.fillRect(s/-2, s/-2, s, s);
  ctx.strokeRect(s/-2, s/-2, s, s);
}

// Draw digit i
function digit(ctx, c, i) {
  ctx.fillStyle = c[1];
  ctx.fillText(i, 0, 0);
}

// Move to startpoint of next rectangle
function nextrec(ctx) {
  ctx.translate(s,0);
}

// Move to startpoint of line l
function linedown(ctx, l) {
  ctx.translate(-l*s - s/2, s);  
}

// Draw a rectangle and its digit
function cell(ctx, c, i) {
  rect(ctx, c);
  if (p) digit(ctx, c, i);
  nextrec(ctx);
}

