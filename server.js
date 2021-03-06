const express = require("express");
const bodyParser = require("body-parser");
const cors = require("express-cors");
const clientSessions = require("client-sessions");

const app = express();


var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(
  cors({
    allowedOrigins: [
      "localhost:5500",
      "127.0.0.1:62313",
      "127.0.0.1:5500",
      "localhost:8080",
      "localhost:3000",
      "127.0.0.1:61497",
      "127.0.0.1:8080",
      'localhost:8081', '127.0.0.1:8081'
    ]
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const playlistRoutes = require("./routes/PlaylistRoutes");
playlistRoutes(app);

const addUserRoutes = require("./routes/UserRoutes.js");
addUserRoutes(app);

app.use(
  clientSessions({
    cookieName: "session",
    secret: "C0d1ng 1s fun 1f y0u kn0w h0w", // set this to a long random string!
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

io.on(`connection`, function(socket) {
  socket.on("moveSong", (songInfo) => {        
    socket.broadcast.emit("moveSong", songInfo);
  });

  socket.on("playingNewSong", () => {
    socket.broadcast.emit("playingNewSong");
  });
  
  socket.on("userJoined", (isSongPlaying) => {
    console.log(isSongPlaying);
    
    socket.broadcast.emit("userJoined", isSongPlaying);
  });
  
  socket.on("startPlay", (currSongTime) => {
    socket.broadcast.emit("startPlay",currSongTime);
  });
  
  socket.on("deleteSong", (videoId) => {
    socket.broadcast.emit("deleteSong",videoId);
  });

  socket.on("pauseSong", () => {
    socket.broadcast.emit("pauseSong");
  });

  socket.on("resumeSong", () => {
    socket.broadcast.emit("resumeSong");
   
  });

  socket.on("addSong", (songToAdd) => {
    socket.broadcast.emit("addSong", songToAdd);
  });

});

http.listen(3000, () => console.log("App is listening on port 3000!"));

// const port = process.env.PORT||3000

// app.listen(port, 
// 	() => console.log(`Example app listening on port ${port}!`));

// const PORT = process . env . PORT || 3000
// app . listen ( PORT , () => console . log ( ` Example app listening on port
// ${ PORT } ! ` )) ;
