/// <reference path="pixi/pixi.js" />

// aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  Loader = PIXI.loader,
  Rectangle = PIXI.Rectangle,
  Resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.utils.TextureCache,
  Point = PIXI.Point,
  width = 800,
  height = 600;

// create a PIXI application
let app = new Application({
  width: width,
  height: height,
  antialias: true,
  transparent: false,
  resolution: 1
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

Loader.add("OXFORD_TRAIN.png")
  .load(setup);

let points = [];
let count = 0.0;
let xinterval;

function setup() {
  var point1 = new Point(101.0, 382.0),
    point2 = new Point(570.0, 43.0);
  let rise = Math.abs(point2.y - point1.y);
  let run = Math.abs(point2.x - point1.x);

  xinterval = (run / 25.0);
  let yinterval = (rise / 25.0);

  for (let i = 0; i <= 25; i++) {
    points.push(new Point(point1.x + (xinterval * i), point1.y - (yinterval * i)));
  }

  let strip = new PIXI.mesh.Rope(Resources["OXFORD_TRAIN.png"].texture, points);
  strip.transform
  app.stage.addChild(strip);

  app.ticker.add(delta => draw(delta));
}

function draw(delta) {
  count += 0.1;

  for (let i = 0; i < points.length; i++) {
    points[i].y = Math.sin((i * 0.5) + count) * 30 + 250;
    points[i].x = i * xinterval * 2 + Math.cos((i * 0.3) + count) * 20;
  }
}