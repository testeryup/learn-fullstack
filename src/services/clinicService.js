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
module.exports = {
    createClinic
}