const fs = require('fs');
const Path = require('path');
const execa = require('execa');

if (!fs.existsSync(`node_modules/@samoyed`)) {
  execa.shell(`ln -s ../packages @samoyed`, {
    cwd: Path.join(process.cwd(), 'node_modules')
  });
}
