// Imports
var Course = require("./models/course");
const express = require("express");
// Setup express
const app = express();

var mongoose = require("mongoose");
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Setup body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Variables
var leaderboardList = []

// Setup response headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Setup sockets 
io.on('connection', (socket) => {
    socket.on('leaderboardPublisherFromSingleUser', (user) => {

      if (user == null) {
        io.emit('leaderboardSubscriber', leaderboardList)
        return
      }

      console.log('leaderboardPublisherFromSingleUser', user);
      
      // Find if the user is already registered
      const oldUserMatchingId = leaderboardList.find(oldUser => {
        return user.id === oldUser.id;
      })

      // Edit the score
      if (oldUserMatchingId == null) {
        user.score = 1
        leaderboardList.push(user);
      } else {
        oldUserMatchingId.score += 1
        // oldUserMatchingId.score = user.score;
      }

      leaderboardList.sort((a, b) => (a.score < b.score) ? 1 : -1);

      io.emit('leaderboardSubscriber', leaderboardList)
  })

  socket.on('leaderboardPublisherClear', () => {
    console.log('Clearing leaderboard');

    leaderboardList = [];
    io.emit('leaderboardSubscriber', leaderboardList)
})
});
http.listen(3000, function(){
  console.log('listening to http on *:3000');
});

//Set up default mongoose connection and start server
const mongoDB =
  "mongodb://dev:abcdef1@ds117866.mlab.com:17866/hackathon-onboard";
mongoose.connect(mongoDB, { useNewUrlParser: true }, err => {
  if (err) return console.log(err);
 
});

// Sockets
io.on('connection', function(socket){
  console.log('a user connected');
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello TS");
});

app.get("/courses", (req, res) => {
  Course.find({}, (err, courses) => {
    res.send(courses);
  });
});

app.get("/course/:id", (req, res) => {
  Course.find({ id: req.params.id }, (err, course) => {
    if (err) return handleError(err);
    res.send(course);
  });
});

app.post("/course/:id", (req, res) => {
  var body = req.body;
  body.id = req.params.id;

  Course.find({ id: body.id }, function(err, course) {
    if (err) return handleError(err);
    if (course) {
      Course.deleteOne({ id: body.id }, function(err) {
        if (err) return handleError(err);
        createCourse(res, body);
      });
    } else {
      createCourse(res, body);
    }
  });
});

function createCourse(res, body) {
  Course.create(body, function(err, result) {
    if (err) console.log(err);
    res.send(result);
    // saved!
  });
}

function handleError(err) {
  console.log(err);
}
