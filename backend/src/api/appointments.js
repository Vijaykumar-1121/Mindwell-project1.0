const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, deleteAppointment } = require('../controllers/appointmentControllers');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAppointments)
    .post(protect, createAppointment);

router.route('/:id')
    .delete(protect, deleteAppointment);

module.exports = router;
