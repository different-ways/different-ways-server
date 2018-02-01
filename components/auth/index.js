const auth = require('./auth');

class Stories {
  constructor(app) {
    this.app = app;
  }

  init() {

  }

  determineUser(req) {
    return new Promise((resolve, reject) => {
      let bearer = req.header('Authorization');
      if (bearer) {
        bearer = bearer.split(' ');
        if (bearer.length === 2) {
          bearer = bearer[1]; // now that's the token
          return auth.determineUser(bearer).catch(reject).then(resolve);
        }
      }
      reject('Invalid');
    });
  }

  premiddleware(req, res, next) {
    try {
      this.determineUser(req)
          .then(user => {
            req.user = user;
            next();
          })
          .catch(err => {
            next()
          });
    } catch (er) {
      console.error(er);
    }
  }
}

module.exports = Stories;