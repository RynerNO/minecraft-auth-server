import config from '@src/config';

import jwt from 'jsonwebtoken';
import { modelOptions, mongoose, prop } from '@typegoose/typegoose';
import { getLogger } from '@helpers';

const log = getLogger('Models');

@modelOptions({ schemaOptions: { _id: false } })
export class Token {
	@prop()
	public expireAt: Date;
	@prop()
	public value: string;
	@prop()
	public static isExpired(expireAt: Date): boolean {
		log('isExpired check', expireAt);
		return expireAt.getTime() <= Date.now();
	}
	public refresh(id: mongoose.Types.ObjectId) {
		this.generate(id);
		log('Token refreshed');
	}
	public generate(id: mongoose.Types.ObjectId) {
		this.expireAt = new Date(Date.now() + Number(config.TOKEN_EXPIRE_MS));
		this.value = jwt.sign({ id: id, expireAt: this.expireAt }, config.JWT_SECRET);
		log('Token created');
	}
}
