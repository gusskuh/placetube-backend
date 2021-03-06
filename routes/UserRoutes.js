var UserService = require('../services/UserService')

module.exports = app => {
  app.post('/login', (req, res) => {
    const user = req.body;
    UserService.checkLogin(user).then(userFromDB => {
      if (userFromDB) {
        delete userFromDB.password;

        res.json({ token: 'Beareloginr: puk115th@b@5t', user: userFromDB });
      } else {
        // console.log('Login NOT Successful');
        res.status(403).send({ error: 'Login failed!' });
      }
    });
  });

  app.post('/register', function (req, res) {
    var user = req.body;
    
    UserService.addUser(user)
      .then(addedUser => res.json(addedUser))
      .catch(err => res.status(403).send({ error: `Register failed, ERROR:${err}` }));
  });

  app.post('/logout', function (req, res) {
    res.end('Loggedout');
  });

  app.put(`/:userId`, (req, res) => {
    const userId = req.params.userId;
    const user = req.body;
    user._id = userId;
   UserService.updateUser(user)
      .then(user => res.json(user))
      .catch(err => res.status(500).send("Could not update user"));
  });

  app.get('/users', (req, res) => {
    UserService.getUsers(req.query).then(users => {
      res.json(users)
    })
    .catch(err => res.status(500).send(err.message))
  })

  // app.get('/profile', isLoggedIn, (req, res) => {
  //   res.end(`Profile of ${req.session.user.name}`);
  // });



};


