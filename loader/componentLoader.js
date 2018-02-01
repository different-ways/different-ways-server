"use strict";
const path = require("path");
const fs = require('fs');
const requireAll = require('require-all');

const COMPONENTS_PATH = "components";

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function loadComponents(app) {
  const componentDirs = getDirectories(path.join(app.cwd, COMPONENTS_PATH));
  for (const componentDir of componentDirs) {
    const componentAbsDir = path.join(app.cwd, COMPONENTS_PATH, componentDir);
    try {
      console.info('loading ' + componentAbsDir + "/index");
      let component = require(path.join(componentAbsDir, "index"));
      app.components[componentDir] = component = new component(app);
      // mount premiddleware if it exists
      if (component.premiddleware) {
        app.use(component.premiddleware.bind(component));
      }
      console.info('loaded ' + componentAbsDir + "/index");
    } catch (err) {
      console.warn("Could not load component file in " + componentAbsDir + "\n" + err.message);
    }
  }
  for (const componentDir of componentDirs) {
    // try to load routes if they exists
    const componentAbsDir = path.join(app.cwd, COMPONENTS_PATH, componentDir);
    try {
      console.log(path.join(componentAbsDir, "routes"));
      app.routes[componentDir] = require(path.join(componentAbsDir, "routes"));
      app.use('/'+componentDir, app.routes[componentDir]);
    } catch (e) {
      console.warn("Could not load routes file in " + componentAbsDir + "\n" + e.message);
    }
  }

  // load models
  try {
    const modelsDir = path.join(app.cwd, "models");
    if (fs.existsSync(modelsDir) && fs.statSync(modelsDir).isDirectory()) {
      const models = requireAll(modelsDir);
      Object.assign(app.models, models);
    }
  } catch (err) {

  }
  // initialize components
  for (const componentName of Object.keys(app.components)) {
    try {
      app.components[componentName].init();
    } catch (err) {
      console.warn("Could not initialize component " + componentName + "\n" + err.stack);
    }
  }
}

module.exports = {
  loadComponents
};