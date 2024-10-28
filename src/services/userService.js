import { where } from "sequelize"
import db from "../models/index"
import { promiseImpl, resolveInclude } from "ejs"
import bcrypt from "bcryptjs"
import { raw } from "express";
var salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkUserEmail(email);

            let user = await db.User.findOne({
                where: {email: email},
                attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                raw: true
            })

            if (isExit) {
                let check = bcrypt.compareSync(password, user.password);
                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = 'ok';

                    delete user.password;

                    userData.user = user;
                }
                else{
                    userData.errCode = 3;
                    userData.errMessage = 'Wrong password!';
                }
            }
            else{
                userData.errCode = 1;
                userData.errMessage = `User does not exist!`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if (user) {
                resolve(true);
            }
            else{
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    },
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                return resolve({
                    errCode: 1,
                    errMessage: "Your email is already registerd before!"
                })
            }

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

            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e);
        }
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

let deleteUser = (userId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
    
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist!`
                })
            }
    
            user = db.User.build(user);
            await user.destroy();
            resolve({
                errCode: 0,
                message: `The user is deleted!`
            })
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData =  (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing input parameters!'
                })
            }
            console.log('id', data.id);
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Updated new users info!'
                })
            }
            else{
                resolve({
                    errCode: 1,
                    errMessage: `User not found!`
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            }
            else{
                let response = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                response.errCode = 0;
                response.data = allcode;
                resolve(response);
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin, getAllUsers, createNewUser, deleteUser, updateUserData, getAllCodeService
}