import { getLogger } from '@src/helpers';
import User from '@src/models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config';
import md5 from 'md5';
import { Token } from '@src/models/subDoc/Token';
const log = getLogger('Router');
export async function join(req: Request, res: Response) {
	const {
		accessToken,
		serverId,
		selectedProfile,
	}: { accessToken: string; serverId: string; selectedProfile: string } = req.body;
	const data: any = jwt.verify(accessToken, config.JWT_SECRET);
	if (!data.expireAt || Token.isExpired(new Date(data.expireAt)))
		return res.status(401).json({
			error: 'Пожалуйста войдите через лаунчер',
		});
	const user = await User.findById(data.id);
	if (!user) {
		res.status(400).send();
	}
	if (!user.uuid) user.uuid = md5(user.name);
	user.refreshToken();
	user.save();
	res.status(204).send();
}
export async function hasJoined(req: Request, res: Response) {
	const { name, serverId } = req.body;
	const user = await User.findOne({
		name: name,
	});

	if (user) {
		res.json({
			uuid: user.uuid,
			name: user.name,
		});
	} else res.status(400).send();
}
export default {
	join,
	hasJoined,
};
