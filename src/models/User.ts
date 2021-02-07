
import Bcrypt from 'bcryptjs';
import { getModelForClass, mongoose, post, pre, prop, Ref } from '@typegoose/typegoose'
import { Token } from './subDoc/Token';


export class userClass {
  public _id: mongoose.Types.ObjectId;
  @prop()
  public createdAt: Date
  @prop()
  public emailConfirmCode: string | null
  @prop({justOne: true})
  public token: Token
  @prop({ required: true, unique: true })
  public name: string
  @prop({ required: true, unique: true })
  public email: string
  @prop({ required: true })
  public password: string
  @prop({required: false, default: {}})
  public userProperties: Object
  @prop()
  public uuid: string
  public comparePasswords(plainPassword: string): boolean {
    return Bcrypt.compareSync(plainPassword, this.password);
  }
  public generateToken() {
    this.token.generate(this._id)
  }
  public refreshToken() {
    this.token.refresh(this._id)
  }
}


export const User = getModelForClass(userClass);

export default User;
