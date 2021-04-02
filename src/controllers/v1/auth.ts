import { getLogger } from '@src/helpers';
import User from '@src/models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config';
import uniqid from 'uniqid';
import md5 from 'md5';
import Bcrypt from 'bcryptjs';
import { Token } from '@src/models/subDoc/Token';

const log = getLogger('Controllers');

export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		log('Received Login Request');
		const user = await User.findOne({ email });

		if (!user || !user.comparePasswords(password)) {
			return res.status(400).json({ message: 'Неверный логин или пароль' });
		}
		user.refreshToken();
		await user.save();
		return res.status(200).json({
			uuid: user.uuid,
			name: user.name,
			accessToken: user.accessToken.value,
		});
	} catch (e) {
		log('Error: ', e);
	}
}
export async function register(req: Request, res: Response) {
	try {
		const { name, email, password } = req.body;
		log('Received Request', req.body);
		const user = await User.create({
			name: name,
			email: email,
			password: Bcrypt.hashSync(password),
			uuid: md5(name),
			accessToken: new Token(),
			emailConfirmCode: uniqid(),
			createdAt: new Date(),
		});
		user.generateToken();
		await user.save();
		return res.status(201).json({
			uuid: user.uuid,
			name: user.name,
			accessToken: user.accessToken.value,
		});
	} catch (e) {
		log('Error: ', e);
	}
}

export async function verify(req: Request, res: Response) {
	try {
		const { accessToken } = req.body;
		log('Received Request', req.body);
		const data: any = jwt.verify(accessToken, config.JWT_SECRET);
		if (!data.expireAt || Token.isExpired(new Date(data.expireAt)))
			return res.status(401).json({});
		const user = await User.findById(data.id);
		if (!user) {
			return res.status(401).json({});
		}

		user.refreshToken();
		await user.save();
		return res.status(200).json({
			uuid: user.uuid,
			name: user.name,
			accessToken: user.accessToken.value,
		});
	} catch (e) {
		log('Error: ', e);
	}
}

export default {
	login,
	register,
	verify,
};
