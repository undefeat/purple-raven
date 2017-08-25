var shell = require('shelljs');

shell.cp('-R', 'src/public', 'dist/public');
shell.cp('-R', 'src/public/static/css', 'dist/public/static');
shell.cp('-R', 'src/public/static/js', 'dist/public/static');
