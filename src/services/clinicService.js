import db from "../models";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log("check service:", data);
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters!"
                });
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });
                resolve({
                    errCode: 0,
                    errMessage: "Create clinic succeed!"
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

            });
            if (data?.length > 0) {
                data = data.map((item) => {
                    item.image = item.image.toString();
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters!"
                });
            }
            else {
                let data = await db.Clinic.findOne({
                    where: {id: id},
                    attributes: ['descriptionHTML', 'name', 'address']
                });
                
                if(data){
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {clinicId: id},
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic;
                }
                else{
                    data = {};
                }
                resolve({
                    errCode: 0, 
                    data
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
module.exports = {
    createClinic, getAllClinic, getDetailClinicById
}