var express = require('express');
var request = require('request');
var session = require("express-session");
var mongoose= require('mongoose');

var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};

mongoose.connect('mongodb://AlexisJamin:RakvJtsO@ds129352.mlab.com:29352/moviz', options, function(err) {
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(
 session({ 
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: false,
 })
);

var myMovieSchema = mongoose.Schema({
    title: String,
    poster_path: String,
    overview: String
});

var myMovieModel = mongoose.model('myMovie', myMovieSchema);

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

var userModel = mongoose.model('user', userSchema);

var movieList=[];

var homeHeader;
var myMoviesHeader;
var contactHeader;
var loginHeader;
var signUpHeader;

var poster = "https://image.tmdb.org/t/p/w500";

app.get('/home', function (req, res) {

request("https://api.themoviedb.org/3/movie/popular?api_key=54c7f44c2377f1dcb4e6944f8049a6cc&language=fr&page=1", function(error, response, body) {
  body = JSON.parse(body);
  movieList=[];
  for (var i = 0; i < body.results.length; i++) {
  
  movieList.push({title : body.results[i].title, poster_path : body.results[i].poster_path, overview : body.results[i].overview});
  
     }
  
  res.render('home', {titre : 'Last releases', movieList : movieList, poster : poster, homeHeader : true, myMoviesHeader : false, contactHeader : false, loginHeader : false, signUpHeader : false});

  })

});

app.get('/research', function (req, res) {

if (req.query.research != '') {

request("https://api.themoviedb.org/3/search/movie?api_key=54c7f44c2377f1dcb4e6944f8049a6cc&language=fr&query="+req.query.research+"&page=1&include_adult=false", function(error, response, body) {
  body = JSON.parse(body);
  movieList=[];
  for (var i = 0; i < body.results.length; i++) {
  
  movieList.push({title : body.results[i].title, poster_path : body.results[i].poster_path, overview : body.results[i].overview});
  
     }
  
  res.render('home', {titre : 'Results', movieList : movieList, poster : poster, homeHeader : true, myMoviesHeader : false, contactHeader : false, loginHeader : false, signUpHeader : false});

  })
 }

});

app.get('/contact', function (req, res) {
    res.render('contact', {titre : 'Last releases', homeHeader : false, myMoviesHeader : false, contactHeader : true, loginHeader : false, signUpHeader : false});
});

app.get('/login', function (req, res) {

  if (req.query.email != undefined && req.query.password != undefined)
 {
  if (req.query.email != '' && req.query.password != '' ) 
     {
      userModel.find( { email: req.query.email, password: req.query.password} , null,  function (err, users) {
        console.log(users);
        res.redirect('home');
       })
     
     } else {

    res.render('login', {error : 'Veuillez rentrer tous les champs', titre : 'Last releases', homeHeader : false, myMoviesHeader : false, contactHeader : false, loginHeader : true, signUpHeader : false});
    }  
 }else {

    res.render('login', {error : null, titre : 'Last releases', homeHeader : false, myMoviesHeader : false, contactHeader : false, loginHeader : true, signUpHeader : false});
  }
});

app.get('/signup', function (req, res) {

 if (req.query.firstName != undefined && req.query.lastName != undefined && req.query.email != undefined && req.query.password != undefined)
 {
     if (req.query.firstName != '' && req.query.lastName != '' && req.query.email != '' && req.query.password != '' ) 
     {

    var userList = new userModel ({
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email,
    password: req.query.password
     });
    
    userList.save(function (error, userList) {
    
    res.redirect('home');
      
    })
   }
   else {
    res.render('signup', {error : 'Veuillez rentrer tous les champs', titre : 'Last releases', homeHeader : false, myMoviesHeader : false, contactHeader : false, loginHeader : false, signUpHeader : true})
   }
 }
   else{
    res.render('signup', {error : null, titre : 'Last releases', homeHeader : false, myMoviesHeader : false, contactHeader : false, loginHeader : false, signUpHeader : true})
   }
  });

app.get('/review', function (req, res) {

 var movieNotSaved = false;

    if (req.query.id === undefined) {
    
    myMovieModel.find(function (err, myMovieLists) {
    myMovieList=myMovieLists;
    res.render('review', {movieList : movieList, titre : 'Last releases', poster : poster, myMovieList : myMovieList, homeHeader : false, myMoviesHeader : true, contactHeader : false, loginHeader : false, signUpHeader : false});

       });
    }
    else {

    myMovieModel.find( { title: movieList[req.query.id].title} , null,  function (err, myMovieLists) {

     if (myMovieLists.length === 0) 
     {
      movieNotSaved = true;
     }

      if (movieNotSaved) {
     
    console.log("on écrit");    
    var myMovieList = new myMovieModel ({
    title: movieList[req.query.id].title, 
    poster_path: movieList[req.query.id].poster_path, 
    overview: movieList[req.query.id].overview 
     });
    
    myMovieList.save(function (error, myMovieList) {
    
    myMovieModel.find(function (err, myMovieLists) {
    myMovieList=myMovieLists;
    res.render('review', {movieList : movieList, titre : 'Last releases', poster : poster, myMovieList : myMovieList, homeHeader : false, myMoviesHeader : true, contactHeader : false, loginHeader : false, signUpHeader : false});

        });
       })
      }

      else {
        console.log("existe déjà !");
        myMovieModel.find(function (err, myMovieLists) {
        myMovieList=myMovieLists;
        res.render('review', {movieList : movieList, titre : 'Last releases', poster : poster, myMovieList : myMovieList, homeHeader : false, myMoviesHeader : true, contactHeader : false, loginHeader : false, signUpHeader : false});

       });
        
      }
     
    });
      
    }
    });

app.get('/single', function (req, res) {
console.log(req.query.id);
  var id= req.query.id;
    res.render('single', {titre : 'Last releases', movieList : movieList, poster : poster, id: id});
});

app.listen(8080, function () {
  console.log("Server listening on port 8080");
});