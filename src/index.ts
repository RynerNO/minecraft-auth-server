import express from 'express';
import cors from 'cors';
import router from './router/index';
import { getLogger } from './helpers';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from '@src/config';
import axios from 'axios';
const log = getLogger('Main');
mongoose
	.connect(config.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		log('Mongoose conected');
	});
const app = express();
app.use(bodyParser.json());
app.use(
	cors({
		origin: '*',
	})
);
app.use(router);

function herokuAntiSleep() {
	const herokuhost = config.HEROKU_HOST;
	setInterval(() => {
		axios.get(`${herokuhost}`);
	}, 1200000);
}

app.listen(config.PORT, () => {
	herokuAntiSleep();
	log(`API is listening on port ${config.PORT}.`);
});

export default app;
