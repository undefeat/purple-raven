var shell = require('shelljs');

shell.cp('-R', '../purple-raven-client/build', 'dist/public');
shell.cp('-R', '../purple-raven-client/build/static/css', 'dist/public/static');
shell.cp('-R', '../purple-raven-client/build/static/js', 'dist/public/static');
