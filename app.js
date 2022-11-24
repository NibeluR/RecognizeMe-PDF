//declare imports
const express = require("express");
const favicon = require('express-favicon');
const app = express();
const fs = require("fs");
const path = require("path");

const multer = require("multer");
const { TesseractWorker } = require("tesseract.js");
const worker = new TesseractWorker();

//Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).single("recognizer-project");

app.set("view engine", "ejs");
app.use(express.static("public"));   
app.use(favicon(__dirname + '/public/favicon.ico'));

//Uploads deletion
setInterval(function() {
  walkDir('./uploads/', function(filePath) {
  fs.stat(filePath, function(err, stat) {
  var now = new Date().getTime();
  var endTime = new Date(stat.mtime).getTime() + 86400000; // 1days in miliseconds

  if (err) { return console.error(err); }

  if (now > endTime) {
      //console.log('DEL:', filePath);
    return fs.unlink(filePath, function(err) {
      if (err) return console.error(err);
    });
  }
})  
});
}, 1800000); // DELETE Uploads every 30min
console.log('uploads folder is cleaned');

function walkDir(dir, callback) {
fs.readdirSync(dir).forEach( f => {
  let dirPath = path.join(dir, f);
  let isDirectory = fs.statSync(dirPath).isDirectory();
  isDirectory ? 
    walkDir(dirPath, callback) : callback(path.join(dir, f));
});
};

//threejs library


//Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if (err) return console.log('Something went wrong.', err);

            worker
            .recognize(data, "eng+rus+deu", {tessjs_create_pdf: "1" })
            .progress(progress => {
                console.log(progress);
            })
            .then(result => {
                res.redirect('/download')
            })
            .finally(() => worker.terminate());
        });
    });
});

app.get('/download', (req, res) => {
    const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
    res.download(file);
});

//start server
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});




/* //TESTING CODE FOLLOW MOUSE

const canvas = document.querySelector('canvas.webgl');

const PI = Math.PI;

const scene = new THREE.Scene();

// INSTANTIATE LOADER
const loader = new THREE.GLTFLoader();

const modelGroup = new THREE.Group();

// LOAD GLTF MODEL
loader.load(
  '/images/profile-icon.glb',
  function(gltf) {

    modelGroup.add(gltf.scene);
    scene.add(modelGroup);

  },
  // IN PROGRESS
  function(xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // ERROR
  function(error) {

    console.log('An error happened');

  }
);

// WINDOW SIZE OBJECT
const sizes = {
  width: window.innerWidth / 2.5,
  height: window.innerHeight / 2.5
};

// INSTANTIATE CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 23;
scene.add(camera);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.x = 20;
directionalLight.position.z = 10;
scene.add(directionalLight);

// WINDOW RESIZE HANDLER
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth / 2.5;
  sizes.height = window.innerHeight / 2.5;

  camera.aspect = (sizes.width / sizes.height);
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// MOUSEMOVE ANIMATION
window.addEventListener('mousemove', (event) => {
  modelGroup.rotation.y = (event.clientX / window.innerWidth) - 0.5;
  modelGroup.rotation.x = (event.clientY / window.innerHeight) - 0.5;

  modelGroup.position.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
  modelGroup.position.y = ((event.clientY / window.innerHeight) - 0.5) * -15;
});

// INSTANTIATE RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setClearColor(0x000000, 0);

// ANIMATION LOOP
const tick = () => {
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();


window.addEventListener('mousemove', function(e){
    var mouse3D = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );

    your3Dobject.lookAt(mouse3D);
}) */