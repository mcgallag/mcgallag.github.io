// canvas 375 x 667
const CANVAS_WIDTH = 375;
// const CANVAS_HEIGHT = 667;
let CANVAS_HEIGHT = 424;
let fontHeight = 24;
let ctx, canvas, gumba;
let aspectRatio, imgHeight;
let msgHeight;
let minimumMsgHeight;

function main() {
  canvas = document.getElementById("canvas");
  if (canvas instanceof HTMLCanvasElement) {
    ctx = canvas.getContext("2d");

    let fontElement = document.getElementById("fontsize");
    fontElement.addEventListener("input", (evt) => {
      fontChangedEventHandler(evt);
    });
    
    let msgElement = document.getElementById("message");
    msgElement.addEventListener("input", (evt) => {
      messageChangeEventHandler(evt);
    });
    
    gumba = document.getElementById("gumba");
    aspectRatio = gumba.height / gumba.width;
    imgHeight = CANVAS_WIDTH * aspectRatio;

    setFontHeight(fontElement.value);

    canvas.width = CANVAS_WIDTH;
    let msgHeight = calculateMessageHeight(lineWrap(""));
    canvas.height = imgHeight + msgHeight;
    
    render();
  }
}

function lineWrap(msg) {
  let words = msg.toUpperCase().split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = ctx.measureText(currentLine + " " + word).width;
    if (width < canvas.width) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function setFontHeight(newHeight) {
  fontHeight = parseInt(newHeight);
  minimumMsgHeight = fontHeight * 4 + 12;
  ctx.font = `${fontHeight}px Impact`;

  let lbl = document.getElementById("fontsizeLabel");
  lbl.innerText = `Font: ${fontHeight}`;
}

function calculateMessageHeight(lines) {
  minimumMsgHeight = fontHeight * 4 + 12;
  let calc = lines.length * fontHeight + 12;
  return (calc < minimumMsgHeight) ? minimumMsgHeight : calc;
}

function fontChangedEventHandler(evt) {
  setFontHeight(evt.target.value);
  render();
}

function messageChangeEventHandler(evt) {
  // console.dir(evt.target.value);
  render();
}

function render() {
  let msg = document.getElementById("message").value;

  // wrap message at canvas width
  // https://stackoverflow.com/a/16599668
  let lines = lineWrap(msg);

  let newMsgHeight = calculateMessageHeight(lines);
  if (newMsgHeight != msgHeight) {
    msgHeight = newMsgHeight;
    canvas.height = imgHeight + msgHeight;
    // set up context for message
    ctx.font = `${fontHeight}px Impact`;
    ctx.textAlign = "center";
  }

  // draw image  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gumba, 0, 0, canvas.width, imgHeight);

  ctx.fillStyle = "white";

  let y = imgHeight + fontHeight;
  let x = canvas.width / 2;

  lines.forEach(line => {
    ctx.fillText(line, x, y, canvas.width);
    y += fontHeight;
  });
}

window.addEventListener("load", main);