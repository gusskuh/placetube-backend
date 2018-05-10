const PLAYLIST_URL = "/data/playlists";
const PlaylistService = require("../services/PlaylistService.js");

module.exports = app => {
  app.get(PLAYLIST_URL, (req, res) => {
    PlaylistService.getplayLists(req.query)
      .then(playlists => {
        res.json(playlists);
      })
      .catch(err => res.status(500).send(err.message));
  });

  app.get(`${PLAYLIST_URL}/:playlistId`, (req, res) => {
    console.log("inside the funclsd")
    const playlistId = req.params.playlistId;
    console.log(playlistId)
    PlaylistService.getById(playlistId)
      .then(playlist => {
        res.json(playlist);
      })
      .catch(err => res.status(500).send(err.message));
  });

  app.delete(`${PLAYLIST_URL}/:playlistId`, (req, res) => {
    const playlistId = req.params.playlistId;
    
    if (!playlistId) {
      res.status(500).send("Missing PlaylistID to delete");
    }
    PlaylistService.deletePlaylist(playlistId)
      .then(_ => res.end())
      .catch(err => res.status(500).send("Could not delete playlist"));
  });

  app.put(PLAYLIST_URL, (req, res) => {       
    const playlist = req.body;
    PlaylistService.addPlaylist(playlist)
      .then(addedPlaylist => res.json(addedPlaylist.ops[0]))
      .catch(err => res.status(500).send("Could not add playlist"));
  });

  app.post(`${PLAYLIST_URL}/:playlistId`, (req, res) => {
    const playlistId = req.params.playlistId;
    const songs = req.body;
    console.log('replace songs', playlistId, songs );
    PlaylistService.updateSongs(playlistId, songs)
      .then(playlist => res.json(playlist))
      .catch(err => res.status(500).send("Could not add playlist"));
  });

  app.put(`${PLAYLIST_URL}/:playlistId`, (req, res) => {
    const playlistId = req.params.playlistId;
    const playlist = req.body;
    playlist._id = playlistId;
    PlaylistService.updatePlaylist(playlist)
      .then(playlist => res.json(playlist))
      .catch(err => res.status(500).send("Could not update playlist"));
  });
};
