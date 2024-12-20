import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let response = await clinicService.createClinic(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
            error
        })
    }
}
module.exports = {
    createClinic
}