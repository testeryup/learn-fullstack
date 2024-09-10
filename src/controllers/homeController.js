import db from '../models/index'
import CRUDService from "../services/CRUDservice"
let getHomePage = async (req, res) => {
    try { 
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {data: JSON.stringify(data)});
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('./test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) =>{
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('return crud from server!');
}

let displayGetCRUD = async (req, res) =>{
    let data = await CRUDService.getAllUser();
    console.log(data);
    res.render('displayCRUD', {dataTable: data})
}

let getEditCRUD = async (req, res) =>{
    console.log(req.query.id);
    let userId = req.query.id;
    let user = await CRUDService.getUserInfoById(userId);

    console.log(user);
    return res.render('editCRUD', {user: user});
}

let putCRUD = async (req, res) => {
    let data = req.query;
    console.log(`userid of put crud:`,data);
    await CRUDService.updateUserData(data);
    res.redirect('/get-crud');
}
module.exports = {
    getHomePage, getAboutPage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD
}