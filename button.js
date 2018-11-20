var rpio = require('rpio');

var buttonPin = 7;
var ledPin = 11;

rpio.open(buttonPin, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(ledPin, rpio.OUTPUT, rpio.LOW);

function pollcb(cbpin) {
  var state = rpio.read(cbpin) ? 1 : 0;

  if (state == 1) {
    console.log('button pressed');
    rpio.write(ledPin, rpio.HIGH);
  } else {
    console.log('button released');
    rpio.write(ledPin, rpio.LOW);
  }
}

rpio.poll(buttonPin, pollcb);
