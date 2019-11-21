const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});


app.listen(3000, () => console.log('Server listening on port 3000!'));

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  desc: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async(req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async(req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    desc: req.body.desc,
  });
  try {
    await item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items', async(req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async(req, res) => {
  try {
    var idtodelete = req.params.id;
    let items = await Item.find();
    Item.deleteOne({ _id: idtodelete }, (err, res) => {
      if (err) {
        console.log("issue with deleting");
        throw err;
      }
      else {
        console.log("deleted!");
      }
    })
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async(req, res) => {
  try {
    var idtoedit = req.params.id;
    let items = await Item.find();

    Item.findOne({ _id: req.params.id }, function(err, item) {
      if (err) {
        console.log(err);
      }

      item.title = req.body.title;
      item.desc = req.body.desc;
      item.save(function(err, item) {
        if (err) {
          console.error(err);
        }
        console.log(item._id + " saved.");
      });


    });

  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
