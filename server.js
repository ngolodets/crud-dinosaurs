const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const db = require('./models');
const methodOverride = require('method-override');


const port = 3000;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
  res.render('index');
});

// GET /dinosaurs - index route - gets ALL dinos
app.get('/dinosaurs', function(req, res) {
  db.dinosaur.findAll().then(function(dinosaurs) {
    res.render('dinosaurs/index', {dinosaurs});
  });
});

// GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req, res) {  
  res.render('dinosaurs/new'); 
});

// GET /dinosaurs/:id/edit - update the dinosaur: serve up our EDIT dino form
app.get('/dinosaurs/:id/edit', function(req, res) {  
  db.dinosaur.findOne({
    where: {id: parseInt(req.params.id)}
  })
    .then(function(dinosaur) {
      res.render('dinosaurs/edit', {dinosaur});
  });
});

// GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res) {
  db.dinosaur.findByPk(parseInt(req.params.id))
    .then(function(dinosaur) {
      res.render('dinosaurs/show', {dinosaur});
  });
});

// POST /dinosaurs - post route - add NEW dino info from the form
app.post('/dinosaurs', function(req, res) {
  let newDino = {
    type: req.body.type,
    name: req.body.name
  }
  db.dinosaur.create(newDino).then(function(dino) {
    res.redirect('/dinosaurs');
  });
});

// DELETE /dinosaurs/:id -- DELETE one dinosaur
app.delete('/dinosaurs/:id', function(req, res) {
  db.dinosaur.destroy({
    where: {id: parseInt(req.params.id)}
  }).then(function(response) {
    console.log(response);
    res.redirect('/dinosaurs');
  });
});

// PUT /dinosaurs/:id - updates dinosaur info
app.put('/dinosaurs/:id', function(req, res) {
  db.dinosaur.update({
    name: req.body.name,
    type: req.body.type
  }, {
    where: {id: parseInt(req.params.id)}
  }).then(function(dino) {
    res.redirect('/dinosaurs/' + req.params.id);
  });
});

app.listen(port, function() {
  console.log("🦕 listening  on " + port);
});
