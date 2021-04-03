import { getLogger } from '@src/helpers';
import User from '@src/models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config';
import md5 from 'md5';
import { Token } from '@src/models/subDoc/Token';
const log = getLogger('Controllers');
export async function join(req: Request, res: Response) {
	try {
		const { accessToken }: { accessToken: string; serverId: string; selectedProfile: string } = req.body;
		const data: any = jwt.verify(accessToken, config.JWT_SECRET);
		if (!data.expireAt || Token.isExpired(new Date(data.expireAt))) return res.status(401).json({});
		const user = await User.findById(data.id);
		if (accessToken !== user.accessToken.value) res.status(400).send();
		if (!user) {
			res.status(400).send();
		}
		if (!user.uuid) user.uuid = md5(user.name);
		res.status(204).send();
	} catch (e) {
		log('Error: ', e);
		res.status(400).json({});
	}
}
export async function hasJoined(req: Request, res: Response) {
	try {
		const { name } = req.body;
		log(req.body);
		const user = await User.findOne({
			name: name,
		});

		if (user) {
			res.json({
				id: user.uuid,
				name: user.name,
			});
		} else res.status(400).send();
		log('User:', user);
	} catch (e) {
		log('Error: ', e);
		res.status(400).json({});
	}
}
export default {
	join,
	hasJoined,
};
