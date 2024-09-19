import userService from "../services/userService"
let handleLogin = async (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing input parameters'
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user
    });
}

const handleGetAllUsers = async (req, res) => {
    let id = req.body.id; //ALL, id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing input parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}
module.exports = {
    handleLogin, handleGetAllUsers
}