class Bootstrap {
  constructor(app) {
    this.app = app;
  }

  isFirstTime() {
    return new Promise((resolve, reject) => {
      this.app.components.auth.users.count()
        .then(count => resolve(count === 0))
        .catch(reject)
    });
  }

  doBootstrap(params) {
    return new Promise((resolve, reject) => {
      if (!params || !params.user
          || typeof params.user !== 'object' || Array.isArray(params.user)) {
        reject({status: 400, msg: 'No user given'})
      }
      const user = params.user;
      this.isFirstTime()
        .then(isIt => {
          if (!isIt) return reject({status: 400, msg: 'Already bootstraped'});
          const roles = this.app.components.auth.roles;
          roles.add({
            name: 'admin',
            capabilities: roles.allCapabilities()
          }).then(role => {
            const users = this.app.components.auth.users;
            users.add({
              username: user.username,
              email: user.email,
              password: user.password
            })
            .then(user => {
              roles.addToUser(user._id, role._id)
                  .then(() => resolve(user))
                  .catch(reject)
            })
            .catch(reject)
          })
          .catch(reject)
        })
        .catch(reject)
    });
  }

  init() {

  }
}

module.exports = Bootstrap;