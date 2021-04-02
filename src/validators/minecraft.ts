import { NextFunction, Request, Response } from 'express';
import User from '@src/models/User';
import va from 'validator';
import { getLogger } from '@src/helpers';
const log = getLogger('Validators');

export async function join(req: Request, res: Response, next: NextFunction) {
	const { accessToken, serverId } = req.body;
	const isString = (str: any) => typeof str === 'string' || str instanceof String;

	if (!isString(accessToken) || !isString(serverId)) return res.status(400).send();
	return next();
}
export async function hasJoined(req: Request, res: Response, next: NextFunction) {
	const name = req.query.username;
	const serverId = req.query.serverId;
	const isString = (str: any) => typeof str === 'string' || str instanceof String;

	if (!isString(name) || !isString(serverId)) return res.status(400).send();
	req.body = {
		name: name,
		serverId: serverId,
	};
	return next();
}
export default {
	join,
	hasJoined,
};
