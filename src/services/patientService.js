import db from "../models";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let postPatientBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName
                || !data.fullName || !data.selectedGender || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });
                const [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    },
                });

                //create a booking record
                if (user) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user.id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Create user successfully!",
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) =>{
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                if(appointment){
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update appointment successfully!"

                    });
                }
                else{
                    resolve({
                        errCode: 2,
                        errMessage: "The appointment already verified or does not exist!"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    postPatientBooking, postVerifyBookingAppointment
}