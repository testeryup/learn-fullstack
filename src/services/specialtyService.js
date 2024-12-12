import db from "../models/index"

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log("check service:", data);
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters!"
                });
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });
                resolve({
                    errCode: 0,
                    errMessage: "Create specialty succeed!"
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                
            });
            if(data?.length > 0){
                data = data.map((item) => {
                    // item.image = Buffer.from(item.image).toString('base64');
                    item.image = item.image.toString();
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createNewSpecialty, getAllSpecialty
}