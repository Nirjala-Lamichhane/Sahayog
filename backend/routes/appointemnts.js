const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { fullName, age, address, contact } = req.body;

    // Validation
    if (!fullName || !age || !address || !contact) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      return res.status(400).json({ 
        error: 'Age must be between 1 and 150' 
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      fullName,
      age: ageNum,
      address,
      contact,
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment.id,
        fullName: appointment.full_name,
        age: appointment.age,
        address: appointment.address,
        contact: appointment.contact,
        appointmentNumber: appointment.appointment_number,
        status: appointment.status,
        appointmentDate: appointment.appointment_date,
      },
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error.message.includes('valid contact number')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to book appointment. Please try again.' 
    });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      fullName: apt.full_name,
      age: apt.age,
      address: apt.address,
      contact: apt.contact,
      appointmentNumber: apt.appointment_number,
      status: apt.status,
      appointmentDate: apt.appointment_date,
      createdAt: apt.created_at,
      updatedAt: apt.updated_at,
    }));
    
    res.json({
      count: formattedAppointments.length,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointments' 
    });
  }
});

// Get single appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }
    
    res.json({
      id: appointment.id,
      fullName: appointment.full_name,
      age: appointment.age,
      address: appointment.address,
      contact: appointment.contact,
      appointmentNumber: appointment.appointment_number,
      status: appointment.status,
      appointmentDate: appointment.appointment_date,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointment' 
    });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value' 
      });
    }
    
    const appointment = await Appointment.updateStatus(req.params.id, status);
    
    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }
    
    res.json({
      message: 'Appointment status updated',
      appointment: {
        id: appointment.id,
        fullName: appointment.full_name,
        age: appointment.age,
        address: appointment.address,
        contact: appointment.contact,
        appointmentNumber: appointment.appointment_number,
        status: appointment.status,
        appointmentDate: appointment.appointment_date,
      },
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment' 
    });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const result = await Appointment.delete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }
    
    res.json({
      message: 'Appointment deleted successfully',
      appointmentNumber: result.appointment_number,
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      error: 'Failed to delete appointment' 
    });
  }
});

module.exports = router;