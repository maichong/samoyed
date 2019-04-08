const fs = require('fs');
const Path = require('path');
const childProcess = require('child_process');
const chokidar = require('chokidar');
const del = require('del');

const srcPath = 'packages/';
console.log('watch', srcPath);

chokidar.watch(srcPath, {
  ignored: /node_modules|[\/\\]\./
}).on('raw', (event, file, details) => {
  if (file.endsWith('.ts') && !file.endsWith('.d.ts')) return;
  if (file.endsWith('.tsx')) return;
  let path = file.split(srcPath)[1];
  console.log(event, path);
  let target = Path.join('node_modules/@samoyed', path);
  switch (event) {
    case 'modified':
      fs.copyFileSync(file, target);
      break;
    case 'moved':
      del.sync(target);
      break;
  }
});
