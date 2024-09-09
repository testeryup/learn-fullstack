import bcrypt from 'bcryptjs'
import db from '../models/index';
import { response } from 'express';
var salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
        } catch (e) {
            reject(e);
        }
        resolve(`successfully created a new User!`);
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject)=>{
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = async () => {
    return new Promise((resolve, reject) =>{
        try {
            let user = db.User.findAll({
                raw: true
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser, getAllUser
}