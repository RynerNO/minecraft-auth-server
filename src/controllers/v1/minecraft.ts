import { log } from '@src/helpers';
import User from '@src/models/User'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@src/config'
import uniqid from 'uniqid';
import md5 from 'md5';
import Bcrypt from 'bcryptjs';
import { Token } from '@src/models/subDoc/Token';
export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    log('Received Request', req.body)
    const user = await User.findOne({ email });

    console.log(user.comparePasswords(password))
    if (!user || !user.comparePasswords(password)) {
      return res.status(400).json({message: "Неверный логин или пароль"  });
    }
      user.refreshToken()
      await user.save()
      return res.status(200).json({
        id: user.id,
        name: user.name,
        selectedProfile: {
          id: uniqid(),
          name: user.name,
          userId: user.id,
          createdAt: user.createdAt.getTime(),
          legacyProfile: false,
          suspended: false,
          paid: false,
          migrated: false,
          legacy: false
        },
        userProperties: user.userProperties,
        token: user.token.value
      });
    



}
export async function register(req: Request, res: Response) {
    const { name, email, password }: {name: string, email: string, password: string} = req.body;
    log('Received Request', req.body)
    const user = await User.create({
        name: name, 
        email: email,
        password: Bcrypt.hashSync(password),
        userProperties: {},
        uuid: md5(name),
        token: new Token(),
        emailConfirmCode: uniqid(),
        createdAt:new Date(),
    });
    user.generateToken();
    await user.save()
    return res.status(201).json({
      id: user.id,
      name: user.name,
      userProperties: user.userProperties,
      token: user.token.value
    });
}

export async function verify(req: Request, res: Response) {
  const { accessToken }: {accessToken: string} = req.body;
  log('Received Request', req.body)
  const data: any = jwt.verify(accessToken, config.JWT_SECRET);
  if(!data.expireAt || Token.isExpired(new Date(data.expireAt))) return res.status(401).send()
  const user = await User.findById(data.id);
    if (!user) {
      return res.status(401).send()
    }

  user.refreshToken()
  await user.save()
  return res.status(200).json({
    id: user.id,
    name: user.name,
    userProperties: user.userProperties,
    token: user.token.value
  });
}
export async function join(req: Request, res: Response) {
    const { accessToken, serverId, selectedProfile }: {accessToken: string, serverId: string, selectedProfile: string} = req.body;
    const data: any = jwt.verify(accessToken, config.JWT_SECRET);
  if(!data.expireAt || Token.isExpired(new Date(data.expireAt))) return res.status(401).json({
    "error": "Пожалуйста войдите через лаунчер"
  })
    const user = await User.findById(data.id);
    if (!user) {
      res.status(400).send()
    }
    if(!user.uuid) user.uuid = md5(user.name);
    user.refreshToken()
    user.save()
    res.status(204).send()
   

}
export async function serverVerify(req: Request, res: Response) {
  const { name, serverId } = req.body
  const user = await User.findOne({
    name: name
  })
  
  if(user) {
     res.json({
      id: user.uuid,
      name: user.name
    })
   } else res.status(400).send()
}
export default {
    login,
    register,
    verify,
    join,
    serverVerify
}