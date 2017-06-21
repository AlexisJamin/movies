var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

var movieList = [
{
	name : "Maleficient",
	img : "dummy/thumb-3.jpg",
	description : "Un film qui pète sa mère"
}

];

console.log(movieList);

app.get('/home', function (req, res) {

request("https://api.themoviedb.org/3/movie/popular?api_key=54c7f44c2377f1dcb4e6944f8049a6cc&language=fr&page=1", function(error, response, body) {
  body = JSON.parse(body);
  console.log(body);


    res.render('home', {movieList : movieList});
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.get('/review', function (req, res) {
    res.render('review');
});

app.get('/single', function (req, res) {
    res.render('single');
});

app.listen(8080, function () {
  console.log("Server listening on port 8080");
});