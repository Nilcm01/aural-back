const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const modules = fs.readdirSync(nodeModulesPath).filter(name => name !== '.bin');

// Read existing package.json or create a new one
let packageJson = {};
const packagePath = path.join(__dirname, 'package.json');

if (fs.existsSync(packagePath)) {
  packageJson = require(packagePath);
} else {
  packageJson = {
    name: "my-app",
    version: "1.0.0",
    main: "server.js",
    dependencies: {}
  };
}

// Fill dependencies with "*"
packageJson.dependencies = {};
modules.forEach(name => {
  packageJson.dependencies[name] = "*";
});

// Save updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log(" package.json updated with current dependencies.");