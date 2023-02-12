
var cnv;

function setup() {
  cnv = createCanvas(400, 400);
  cnv.parent("canvas");
  }
  function generate_dots() {
    let x = round(random(20, 381));
    let y = round(random(20, 381));
    let result = (x - 200)**2 + (y - 200)**2;
    // check if within circle 180**2 = 32400
    
    if (result < 32400) {
      stroke('blue');
      strokeWeight(3);
    }
    else {
      stroke('red');
      strokeWeight(3);
    }
    point(x, y);
  }

  function draw() {
   generate_dots();
  }