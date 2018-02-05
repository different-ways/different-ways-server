const auth = require('./auth');

class Stories {
  constructor(app) {
    this.app = app;
  }

  init() {

  }

  can(requirements, user, action, entityType) {
    if (!requirements[action] || !requirements[action][entityType]) return false;
    const caps = requirements[action][entityType];
    if (!user) return caps.includes(null);
    for (const cap of caps) {
      if (cap === null || user.capabilities.has(cap)) {
        return true;
      }
    }
    return false;
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