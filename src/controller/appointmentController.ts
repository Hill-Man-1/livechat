import { format } from 'date-fns';
import { Request, Response } from 'express';
import AppointmentModel from '../models/appointmentModel';
import { errorHandling } from './errorHandling';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';

const createAppointment = async (req: Request, res: Response) => {
    try {
        const patient = req.user?.id;
        const { doctor, hospital, category, date, description } = req.body;

        if (!patient || !doctor || !hospital || !category || !date || !description) {
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
            patient,
            doctor,
            hospital,
            date: formattedDate,
            description,
            category
        });

        return res.status(201).json(
            errorHandling({
                message: 'Appointment successfully created',
                data: appointment,
                location: medicalFacility.name + ', ' + medicalFacility.location?.city,
            }, null)
        );

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
            return res.status(403).json(
                errorHandling(
                    null,
                    `Scheduled Appointment cannot be updated. Please contact our medical team through live chat, call ${medicalFacility?.contact}, or email us at ${medicalFacility?.email}. We will get back to you as soon as possible!`
                )
            );
        }
        
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            message: 'Appointment details successfully Updated',
            data: updatedAppointment,
            location: medicalFacility?.name + ', ' + medicalFacility?.location?.city,
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

const getAppointmentList = async (req: Request, res: Response) => {
    const user = req.user
    let appointments = null;
    try {
        if (user.role === "patient") {
            appointments = await AppointmentModel.find({ patient: user.id });
        } else if (user.role === "medical_admin") {
            const personnel = await MedicalPersonnelModel.findById(user.id)
            appointments = await AppointmentModel.find({ hospital: personnel?.hospital });
            console.log("user:", user, "personnel:", personnel, "hospital id:", personnel?.hospital)
        } else if (user.role === "doctor") { 
            const personnel = await MedicalPersonnelModel.findById(user.id)
            appointments = await AppointmentModel.find({
                hospital: personnel?.hospital,
                doctor: personnel?.id,
                status: { $in: ['scheduled', 'completed'] },
            });
        } else if (user?.role === 'staff' || user?.role === 'admin') {
            appointments = await AppointmentModel.find();
        } else {
            return res.status(403).json(errorHandling(null, 'Forbidden Access'));
        }
    
        return res.status(200).json(
            errorHandling({
                message: 'List of Appointments',
                data: appointments,
            },
            null)
        );
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

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

            return res.status(200).json({
                message: 'Appointment Successfully Cancelled..',
                data: updatedAppointment,
            });

        }  else {
               return res.status(404).json({
                message: `Mr/Ms.${user.last_name} has yet to book an appointment..`
            });}
      
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

        return res.status(200).json({
            message: 'Appointment Status successfully updated',
            data: updatedAppointment,
        });
       
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

export { createAppointment, updateAppointment, getAppointmentList, cancelAppointment, updateAppointmentStatus }