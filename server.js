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
  //TODO: remove the file system stuff (fs) and use sequelize functions (following 2 lines)
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
  //db.dinosaur.findByPk(parseInt(req.params.id))
  db.dinosaur.findOne({
    where: {id: parseInt(req.params.id)}
  })
    //.then(function(response) {
    .then(function(dinosaur) {
      res.render('dinosaurs/edit', {dinosaur});
    });
      //var dinosaur = response.dataValues;
      //console.log(response.dataValues);
      //res.render('dinosaurs/edit', {dinosaur}); //render is ALWAYS a relative path
  //});
});

// GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res) {
  db.dinosaur.findByPk(parseInt(req.params.id))
    .then(function(dinosaur) {
      res.render('dinosaurs/show', {dinosaur});
    });
  // db.dinosaur.findOne({
  //   where: {id: parseInt(req.params.id)}
  // }).then(function(response){
  //   //var dinosaur = response.dataValues;
  //   console.log("Response: " + req.params.id);
  //   res.render('dinosaurs/show', {dinosaur: response.dataValues}); 
  // });
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
  //ANOTHER WAY:
  // db.dinosaur.create({
  //   name: req.body.name,
  //   type: req.body.type
  // }).then(function(data) {
  //   console.log(data);
  //   res.redirect('/dinosaurs');
  // });
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
  // db.dinosaur.findOne({
  //   where: {id: parseInt(req.params.id)}
  // }).then(function(dinosaur) {
  //   //var dinosaur = data.dataValues;
  //   if (dinosaur) {
  //   return dinosaur.update(req.body)
  //   } 
  // }).then(function(response) {
  //   var dinosaur = response.dataValues;
  //   console.log(response.dataValues)
  //   res.redirect('/dinosaurs/' + dinosaur.id);
  // });
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
