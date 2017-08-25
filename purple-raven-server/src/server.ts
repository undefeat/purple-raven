import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as io from 'socket.io';
import * as http from 'http';

import * as usersController from './controllers/userController';
import * as channelController from './controllers/channelController';

const app = express();
const server = http.createServer(app);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/api/channels/:channelName', [
	channelController.checkIfChannelExists,
	channelController.getEncryptedPhrase
]);
app.post('/api/channels/:channelName', channelController.addChannel);

app.get('/api/channels/:channelName/users/:username', usersController.checkIfUsernameExists);
app.post('/api/channels/:channelName/users/:username', [
	usersController.verifyToken,
	usersController.addUser
]);

/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
	console.log(('	App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
	console.log('	Press CTRL-C to stop\n');
});

export default app;
