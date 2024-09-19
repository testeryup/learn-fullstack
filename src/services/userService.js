import { where } from "sequelize"
import db from "../models/index"
import { resolveInclude } from "ejs"
import bcrypt from "bcryptjs"
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkUserEmail(email);

            let user = await db.User.findOne({
                where: {email: email},
                attributes: ['email', 'roleId', 'password'],
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
module.exports = {
    handleUserLogin, getAllUsers
}