
const mongo = require("mongodb");
const DBService = require("./DBService");

function getplayLists() {
  return new Promise((resolve, reject) => {
    return DBService.dbConnect().then(db => {
      db
        .collection("playlists")
        .find()
        .toArray((err, playlists) => {
          if (err) return reject(err);
          // console.log('playlists: ', playlists);
          resolve(playlists);
        });
    });
  });
}

function addPlaylist(playlist) {
   
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db.collection("playlists").insert(playlist, function(err, addedPlaylist) {        
        db
          .collection("users")
          .updateOne(
            { _id: new mongo.ObjectID(addedPlaylist.ops[0].adminId) },
            { $push: { playlistsIds: addedPlaylist.ops[0]._id.toString() } }
          );
        if (err) reject(err);
        else resolve(addedPlaylist);
        db.close();
      });
    });
  });
}

function deletePlaylist(playlistId) {
  
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db.collection("playlists").find({_id: new mongo.ObjectID(playlistId)}).toArray((err, playlist) => {

        console.log(playlist[0].adminId);
        db.collection("users").updateOne(
          { _id: new mongo.ObjectID(playlist[0].adminId) },
          { $pull: { playlistsIds: playlistId } }
        );
        db.collection("playlists").deleteOne({ _id: new mongo.ObjectID(playlistId) }, function(err, res) {
          if (err) reject(err);
          else resolve();
          db.close();
          })
          if (err) reject(err);
          else resolve();
          db.close();
        });
    });
  });
}

function getById(playlistId) {
  playlistId = new mongo.ObjectID(playlistId);
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db
        .collection("playlists")
        .findOne({ _id: playlistId }, function(err, playlist) {
          if (err) reject(err);
          else resolve(playlist);
          db.close();
        });
    });
  });
}

function updatePlaylist(playlist) {
  playlist._id = new mongo.ObjectID(playlist._id);
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db
        .collection("playlists")
        .updateOne({ _id: playlist._id }, playlist, function(
          err,
          updatedPlaylist
        ) {
          if (err) reject(err);
          else resolve(updatedPlaylist);
          db.close();
        });
    });
  });
}

function updateSongs(playlistId, newSongs) {
  playlistId = new mongo.ObjectID(playlistId);
  return new Promise((resolve, reject) => {
    getDB().then(db => {
      db
        .collection("playlists")
        .updateOne({ _id: playlistId }, { $set: { songs: newSongs } }, function(
          err,
          updatedPlaylist
        ) {
          if (err) reject(err);
          else resolve(updatedPlaylist);
          db.close();
        });
    });
  });
}



function getDB() {
  return DBService.dbConnect();
}

module.exports = {
  getplayLists,
  addPlaylist,
  getById,
  deletePlaylist,
  updatePlaylist,
  addPlaylist,
  updateSongs
};