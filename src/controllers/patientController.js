import patientService from '../services/patientService';

let postPatientBooking = async (req, res) => {
    try {
        let infor = await patientService.postPatientBooking(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
            error
        })
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookingAppointment(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
            error
        })
    }
}
module.exports = {
    postPatientBooking, postVerifyBookingAppointment
}