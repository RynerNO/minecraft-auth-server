import { NextFunction, Request, Response } from 'express';
import { getLogger } from '@src/helpers';
const log = getLogger('Validators');

export async function join(req: Request, res: Response, next: NextFunction) {
	try {
		const { accessToken, serverId } = req.body;
		const isString = (str: any) => typeof str === 'string' || str instanceof String;

		if (!isString(accessToken) || !isString(serverId)) return res.status(400).send();
		return next();
	} catch (e) {
		log('Error: ', e);
	}
}
export async function hasJoined(req: Request, res: Response, next: NextFunction) {
	try {
		const name = req.query.username;
		const serverId = req.query.serverId;
		const isString = (str: any) => typeof str === 'string' || str instanceof String;

		if (!isString(name) || !isString(serverId)) return res.status(400).send();
		req.body = {
			name: name,
			serverId: serverId,
		};
		return next();
	} catch (e) {
		log('Error: ', e);
	}
}
export default {
	join,
	hasJoined,
};
