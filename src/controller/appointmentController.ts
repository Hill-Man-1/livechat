import { format } from 'date-fns';
import { Request, Response } from 'express';
import AppointmentModel from '../models/appointmentModel';
import { errorHandling } from './errorHandling';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import UserModel from '../models/userModel';

const createAppointment = async (req: Request, res: Response) => {
    try {
        const patientId = req.user?.id;
        const { doctor, hospital, category, date, description } = req.body;

        if (!patientId || !doctor || !hospital || !category || !date || !description) {
            return res.status(400).json(errorHandling(null, 'Invalid appointment data.'));
        }

        const parsedDate = new Date(date);
        const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

        const medicalFacility = await MedicalFacilityModel.findById(hospital);

        if (!medicalFacility) {
            return res.status(404).json(
                errorHandling(null, 'Medical facility not not found.')
            );
        }

        const appointment = await AppointmentModel.create({
            patient: patientId,
            doctor,
            hospital,
            date: formattedDate,
            description,
            category
        });

        const patientData = await UserModel.findById(patientId);
        const doctorData = await MedicalPersonnelModel.findById(doctor);

        const appointmentData = {
            _id: appointment._id,
            patient: patientData?.first_name + " " + patientData?.last_name,
            doctor: doctorData?.first_name + " " + doctorData?.last_name,
            hospital: medicalFacility?.name,
            date: appointment.date,
            description: appointment.description,
            category: appointment.category,
            status: appointment.status,
        }

        return res.status(201).json(errorHandling({
                message: 'Appointment successfully created',
                data: appointmentData,
                location: medicalFacility.name + ', ' + medicalFacility.location?.city,
            }, null));

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

const updateAppointment = async (req: Request, res: Response) => {
    const id = req.params.appointmentId
    const user = req.user

    try {
        const appointment = await AppointmentModel.findById(id);
        const medicalFacility = await MedicalFacilityModel.findOne();
        const medicalPersonnel = await MedicalPersonnelModel.findById(user.id);

        if (!appointment) {
            return res.status(404).json(errorHandling(null, 'Appointment not found.'));
        }

        if (medicalPersonnel?.role !== 'medical_admin' && appointment.status !== 'pending') {
            return res.status(403).json(errorHandling(null,
                    `Scheduled Appointment cannot be updated. Please contact our medical team through live chat, call ${medicalFacility?.contact}, or email us at ${medicalFacility?.email}. We will get back to you as soon as possible!`
                ));
        }
        
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json(errorHandling({
                message: 'Appointment details successfully Updated',
                data: updatedAppointment,
                location: medicalFacility?.name + ', ' + medicalFacility?.location?.city,
            }, null));

    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

const getAppointmentList = async (req: Request, res: Response) => {
    const user = req.user;
    let appointments = null;
    try {
        if (user.role === "patient") {
            appointments = await AppointmentModel.find({ patient: user.id });

        } else if (user.role === "medical_admin") {
            const personnel = await MedicalPersonnelModel.findById(user.id);

            appointments = await AppointmentModel.find({ hospital: personnel?.hospital });

        } else if (user.role === "doctor") {
            const personnel = await MedicalPersonnelModel.findById(user.id);

            appointments = await AppointmentModel.find({
                hospital: personnel?.hospital,
                doctor: personnel?.id,
                status: ['scheduled', 'completed'],
            });

        } else if (user?.role === 'staff' || user?.role === 'admin') {
            appointments = await AppointmentModel.find();
        } else {
            return res.status(403).json(errorHandling(null, 'Forbidden Access'));
        }

        const appointmentData = [] as any[];

        for (const appointment of appointments) {
            const doctor = await MedicalPersonnelModel.findById(appointment.doctor);
            const patient = await UserModel.findById(appointment.patient);
            const hospital = await MedicalFacilityModel.findById(appointment.hospital);

            const formattedAppointment = {
                _id: appointment._id,
                patient: patient?.first_name + " " + patient?.last_name,
                doctor: doctor?.first_name + " " + doctor?.last_name,
                hospital: hospital?.name,
                date: appointment.date,
                description: appointment.description,
                category: appointment.category,
                status: appointment.status,
            };

            appointmentData.push(formattedAppointment);
        }

        return res.status(200).json(
            errorHandling({
                message: 'List of Appointments',
                data: appointmentData,
            }, null)
        );

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const cancelAppointment = async (req: Request, res: Response) => {
    const id = req.params.appointmentId;
    const { status } = req.body;
    const user = req.user;

    try {
        const appointment = await AppointmentModel.findById(id);

        if (!appointment) {
            return res.status(404).json(errorHandling(null, 'Appointment not found.'));
        }

        if (user.role === 'patient' && appointment.status === 'pending' && status === 'cancelled') {
            const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
                id,
                { $set: { status } },
                { new: true }
            );

            return res.status(200).json(errorHandling({
                    message: 'Appointment Successfully Cancelled..',
                    data: updatedAppointment,
                }, null));

        }  else {
               return res.status(404).json(errorHandling(null, `Mr/Ms.${user.last_name} has yet to book an appointment..`));    
        }
      
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
    const id = req.params.appointmentId;
    const { status } = req.body;

    try {
        const appointment = await AppointmentModel.findById(id);

        if (!appointment) {
            return res.status(404).json(errorHandling(null, 'Appointment not found.'));
        }

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        return res.status(200).json(errorHandling({
                message: 'Appointment Status successfully updated',
                data: updatedAppointment,
            }, null));
       
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

export { createAppointment, updateAppointment, getAppointmentList, cancelAppointment, updateAppointmentStatus }