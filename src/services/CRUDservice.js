import bcrypt from 'bcryptjs'
import db from '../models/index';
import { raw, response } from 'express';
import { where } from 'sequelize';
import { promiseImpl } from 'ejs';
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

let getAllUser =  () => {
    return new Promise(async (resolve, reject) =>{
        try {
            let user = await db.User.findAll({
                raw: true
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById =  (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            if(user){
                resolve(user);
            }
            else{
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve();
            }
            
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            });
            if (user) {
                user.destroy();
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById
}