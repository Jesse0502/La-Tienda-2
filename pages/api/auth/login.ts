import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import {PrismaClient} from '@prisma/client'
import { setCookie } from "cookies-next";
import { addHours } from ".";
var bcrypt = require('bcryptjs');
const db = new PrismaClient()
  

export default async function handler(req: any, res: any){
    if(req.method === "POST"){
        try {
            
        const {email, password} = req.body.data;
        if(!email || !password ) return res.status(400).json({ error: "Missing email or password" })
        
        let user = await db.user.findFirst({
            where: {
                email
            }
        })
            if(user) {
            bcrypt.compare(password, user.password, function(err: any, match: any) {
                if(match === true){
                    const token = jwt.sign({ email: user?.email, id: user?.id, name: user?.name }, `${process.env.JWT_SECRET}`, {expiresIn: "1d"});    
                    setCookie("token", token, {req, res, expires: addHours(24) })
                    return res.status(200).json({token})
                } else return res.status(400).json({error: "Incorrect password!"})
            });
        } else {
            res.status(400).json({error: "No user found with this email!"})
        }
        
    } catch(err: any) {
        res.status(500).json({error: err.message})
    }
} 
    else res.status(401).send({error: "Method Not Allowed"});
    
}