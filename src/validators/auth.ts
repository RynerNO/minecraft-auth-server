import { NextFunction, Request, Response } from 'express';
import User from '@src/models/User';
import va from 'validator';
import { getLogger } from '@src/helpers';
const log = getLogger('Validators');
import ErrorMessages from '../ErrorMessages';
export async function register(req: Request, res: Response, next: NextFunction) {
	try {
		const {
			name,
			email,
			password,
		}: {
			name: string;
			email: string;
			password: string;
		} = req.body;
		if (
			!va.isEmail(email) ||
			!va.isLength(name, {
				min: 3,
				max: 24,
			}) ||
			!va.matches(name, '^[a-zA-Z0-9_-]*$') ||
			!va.isLength(password, {
				min: 8,
			})
		) {
			return res.status(400).json({
				status: 'Error',
				reason: {
					email: !va.isEmail(email),
					username:
						!va.isLength(name, {
							min: 3,
							max: 13,
						}) || !va.matches(name, '^[a-zA-Z0-9_-]*$'),

					password: !va.isLength(password, {
						min: 8,
					}),
				},
			});
		}
		const testUsername = await User.findOne({
			name: name,
		});
		const testEmail = await User.findOne({ email: email });
		if (testUsername || testEmail) {
			let errorMessage = testUsername ? ErrorMessages.NAME_ALREADY_EXISTS : ErrorMessages.EMAIL_ALREADY_EXISTS;
			errorMessage = testUsername && testEmail ? ErrorMessages.EMAIL_AND_NAME_ALREADY_EXISTS : errorMessage;

			return res.status(200).json({
				status: 'Error',
				message: errorMessage,
			});
		}
		next();
	} catch (e) {
		log('Error: ', e);
		res.status(400).json({});
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		let {
			email,
			password,
		}: {
			email: string;
			password: string;
		} = req.body;
		if (!va.isEmail(email) || va.isEmpty(password)) {
			return res.status(400).json({
				status: 'Error',
				reason: {
					email: !va.isEmail(email),
					password: va.isEmpty(password),
				},
			});
		}
		next();
	} catch (e) {
		log('Error: ', e);
		res.status(400).json({});
	}
}

export async function verify(req: Request, res: Response, next: NextFunction) {
	try {
		const { accessToken } = req.body;
		const isString = (str: any) => typeof str === 'string' || str instanceof String;

		if (!isString(accessToken) || accessToken.length < 1) return res.status(401).json({});
		return next();
	} catch (e) {
		log('Error: ', e);
		res.status(400).json({});
	}
}
export default {
	register,
	login,
	verify,
};
