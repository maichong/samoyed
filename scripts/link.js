const fs = require('fs');
const Path = require('path');
const childProcess = require('child_process');

if (!fs.existsSync(`node_modules/@samoyed`)) {
  childProcess.execSync(`ln -s ../packages @samoyed`, {
    cwd: Path.join(process.cwd(), 'node_modules')
  });
}
