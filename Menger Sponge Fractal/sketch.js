let angle = 0;

function setup() {
  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height, WEBGL);
  fill(170);
  LayersSlider = createSlider(1, 4, 2, 1);
  LayersSlider.position(width - 140, 40);
  let LayersLabel = createSpan('Layers');
  LayersLabel.position(width-95, 20);
}
function draw() {
  background(200);
  lights();
  noStroke();
  rotateX(-angle);
  rotateY(angle *0.7);
  rotate(angle * 1.2);
  rotateZ(angle * 0.3);
 
  ambientMaterial(25, 50, 150);
  specularMaterial(100, 50, 200);
  shininess(180);
  subCube(min(width, height)/7, 1);

  angle += 0.01;
}

function subCube(BoxWidth, layer){
  let ZeroOffsets = 0;
  for (let XOffset = -BoxWidth; XOffset <= BoxWidth; XOffset += BoxWidth){
    for (let YOffset = -BoxWidth; YOffset <= BoxWidth; YOffset += BoxWidth){
      for (let ZOffset = -BoxWidth; ZOffset <= BoxWidth; ZOffset += BoxWidth){
        if (XOffset == 0){
          ZeroOffsets += 1;
        }
        if (YOffset == 0){
          ZeroOffsets += 1;
        }
        if (ZOffset == 0){
          ZeroOffsets += 1;
        }
       if (ZeroOffsets < 2){
          push();
          translate(XOffset, YOffset, ZOffset);
          if (layer < LayersSlider.value()){
          subCube(BoxWidth/3, layer + 1);
          }else{
          box(BoxWidth);
          }
          pop();
        }
        ZeroOffsets = 0;
      }
    }
  }
}
