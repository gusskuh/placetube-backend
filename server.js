const express = require('express');
const bodyParser = require('body-parser');
const cors = require('express-cors');
const clientSessions = require('client-sessions');


// var http = require("http").Server(app);
// var io = require("socket.io")(http);

// app.get("/", function(req, res) {
//     res.sendFile(__dirname + `/playlists/5ae9af8eaf34620eb6123336`);
//   });

//   io.on(`connection`, function(socket) {
//     console.log("connected users!!!!!!");
//   }



const app = express()
app.use(cors({
    allowedOrigins: [
        'localhost:5500', '127.0.0.1:5500','localhost:8080', '127.0.0.1:8080'
    ]
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


const playlistRoutes = require('./routes/playlistRoutes')
playlistRoutes(app)

const addUserRoutes = require('./routes/UserRoutes.js')
addUserRoutes(app)

app.use(clientSessions({
    cookieName: 'session',
    secret: 'C0d1ng 1s fun 1f y0u kn0w h0w', // set this to a long random string!
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
    
  }));

app.listen(3000, 
    () => console.log('App is listening on port 3000!')
)



