const mongo = require('mongodb');
const DBService = require('./DBService');


function getSongs(){
    return new Promise((resolve, reject) => {
        return DBService.dbConnect()
            .then(db => {
                db.collection('playlists').find().toArray((err, songs) => {
                    if (err) return reject(err);
                    console.log('songs: ', songs);
                    resolve(songs);
                })
            })
    });
}

function addSong(song) {
    return new Promise((resolve, reject)=>{
        DBService.dbConnect()
        .then(db=>{
            db.collection('playlists').insert(song, function (err, addedSong) {
                if (err)    reject(err)
                else        resolve(addedSong);
                db.close();
            });
        })
    });
}

function deleteSong(songId) {
    songId = new mongo.ObjectID(songId);
    return new Promise((resolve, reject)=>{
        DBService.dbConnect()
        .then(db=>{
            db.collection('playlists').deleteOne({_id: songId}, function (err, res) {
                if (err)    reject(err)
                else        resolve();
                db.close();
            });
        })
    });
}

function getById(songId) {

    songId = new mongo.ObjectID(songId);
    return new Promise((resolve, reject)=>{
        DBService.dbConnect()
        .then(db=>{
            db.collection('playlists').findOne({_id: songId}, function (err, song) {
                if (err)    reject(err)
                else        resolve(song);
                db.close();
            });
        })
    });
}

function updateSong(song) {
    
    
    song._id = new mongo.ObjectID(song._id);
    console.log(song._id, 'dasdsadasdasdasdsa');

    return new Promise((resolve, reject)=>{
        DBService.dbConnect()
        .then(db=>{
            db.collection('playlists').updateOne({_id : song._id}, song, function (err, updatedSong) {
                if (err)    reject(err)
                else        resolve(updatedSong);
                db.close();
            });
        })
    });
}

module.exports = {
    getSongs,
    addSong,
    getById,
    deleteSong,
    updateSong
}