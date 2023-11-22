const fs = require('fs');
const path = require('path');

const directory = 'dist/assets/images';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  }
});
