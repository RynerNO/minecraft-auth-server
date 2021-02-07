import { NextFunction, Request, Response } from "express";
import User from "@src/models/User"
import va from 'validator'
export async function register(req: Request, res: Response, next: NextFunction) {
            const {name, email, password}: {
                name: string,
                email: string,
                password: string
            } = req.body
            if(!va.isEmail(email) || 
                !va.isLength(name, {
                        min: 3,
                        max: 24
                    }) || 
                !va.matches(name, '^[a-zA-Z0-9_-]*$') ||
                !va.isStrongPassword(password, {
                    minLength: 8, minLowercase: 1, minUppercase: 1, 
                    minNumbers: 1, minSymbols: 0
                })) {
                    return res.status(400).json({message: "Неверный логин или пароль"  });
                }
            const testUsername  =  await User.findOne({
                name: name
            })
            if(testUsername) return res.status(400).json({message: "Пользователь с таким именем уже зарегестрирован"  })
            const testEmail = await User.findOne({email: email})
            if(testEmail) return res.status(400).json({message: "Такой email уже существует"  })
            next();
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const {email, password}: {
        email: string,
        password: string
    } = req.body
    if(!va.isEmail(email) || 
        va.isEmpty(password)) {
            return res.status(400).json({message: "Invalid"  });
        }
    next()       
}

export async function join(req: Request, res: Response, next: NextFunction) {
    const { accessToken, serverId, selectedProfile } = req.body;
    const isString = (str: any) => typeof str === 'string' || str instanceof String
   
    if(!isString(accessToken) || !isString(serverId)) return res.status(400).send();
    return next()       
}
export async function serverVerify(req: Request, res: Response, next: NextFunction) {
    const name = req.query.username;
    const serverId = req.query.serverId
    const isString = (str: any) => typeof str === 'string' || str instanceof String
   
    if(!isString(name) || !isString(serverId)) return res.status(400).send();
    req.body = {
        name: name,
        serverId: serverId
    }
    return next()       
}
export async function verify(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.body
    const isString = (str: any) => typeof str === 'string' || str instanceof String
   
    if(!isString(accessToken)) return res.status(401).send();
    return next()       
}
export default {
    register,
    login,
    join,
    serverVerify,
    verify
}