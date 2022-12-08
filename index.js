const express = require('express');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({storage});

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
    return res.json({message: "Hello World"});
});

app.post("/", upload.single("picture"), async (req, res) => {
    fs.access('./uploads', (error) => {
        if (error) {
            fs.mkdirSync("./uploads");
        }
    });

    const {buffer, originalname} = req.file;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${path.parse(originalname).name}.webp`;
    res.setHeader('content-type', 'application/json');
    sharp.cache(false);

    await sharp(buffer)
        .webp({quality: 20})
        .toFile('./uploads/' + ref).then((data) => {
            const link = `http://localhost:3000/${ref}`;
            return res.json({link});
        }).catch(err => {
            console.log(err.Error);
            return res.json({error: err});
        });

});

app.listen(3000);