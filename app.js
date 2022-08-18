//declare imports
const express = require("express");
const favicon = require('express-favicon');
const app = express();
const fs = require("fs");

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


//Routes

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if (err) return console.log('This is error', err);

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
    const file = `${__dirname}/recognizeme-result.pdf`;
    res.download(file);
});


//start server
const PORT = process.env.PORT || 5000;
app.listen((process.env.PORT || 5000), function(){
    console.log('listening port');
});