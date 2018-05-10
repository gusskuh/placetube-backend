const mongo = require('mongodb');
var DBService = require('./DBService');

module.exports.checkLogin = user => {
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db
        .collection('users')
        .findOne({ email: user.email, password: user.password }, function(
          err,
          userFromDB
        ) {
          if (err) reject(err)
          else resolve(userFromDB)
          db.close();
        });
    });
  });
};

function validateDetails(user) {
  console.log(user);
  return user.name !=='puki';
}

module.exports.addUser = user => {
  console.log('user from service', user);
  
  return new Promise((resolve, reject) => {
    let isValidate = validateDetails(user);
    if (!isValidate) reject('Validate failed!');
    DBService.dbConnect().then(db => {
      db
        .collection('users')
        .findOne({ email: user.email }, function(err, userFromDB) {
          // If name is already used!
          if (userFromDB) {
            console.log('email is already used!');
            reject('email is already used!');
            db.close();
          } else {
            db.collection('users').insert(user, (err, res) => {
              if (err) reject(err);
              else resolve(res.ops);
              db.close();
            });
          }
          
        });
    });
  });
};

module.exports.updateUser = user => {
  user._id = new mongo.ObjectID(user._id);
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db
        .collection("users")
        .updateOne({ _id: user._id },{$set:{profileImg: user.profileImg}} , function(
          err,
          updatedUser
        ) {
          if (err) reject(err);
          else resolve(updatedUser);
          db.close();
        });
    });
  });
}


module.exports.getUsers = users => {
    return new Promise((resolve, reject) => {
      return DBService.dbConnect().then(db => {
        db.collection('users').find().toArray((err , users) => {
          if (err) return reject(err)
          resolve(users)
        })
      })
    })
}
