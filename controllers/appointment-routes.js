const router = require('express').Router();
const { Appointment } = require('../models');
const withAuth = require('../utils/auth');

// Get the add new appointment page
router.get('/new', withAuth, async (request, response) => {
  try {
    response.render('add-new-appointment', { loggedIn: request.session.loggedIn });
  } catch (err) {
    console.log(err);
    response.status(500).json(err);
  }
});

// Get the edit appointment page
router.get('/edit/:id', withAuth, async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findByPk(request.params.id, {
      where: {
        id: request.params.id,
      },
      attributes: [
        'id',
        'appnt_date',
        'appnt_time',
        'appnt_for_whom',
        'appnt_with_whom',
        'appnt_location',
        'appnt_note',
        'created_at',
      ],
    });
    if (!dbAppointmentData) {
      response.status(404).json({ message: 'No appointment found with that id' });
      return;
    }
    const appointment = dbAppointmentData.get({ plain: true });
    response.render('edit-appointment', { appointment, loggedIn: request.session.loggedIn });
  } catch (err) {
    console.log(err);
    response.status(500).json(err);
  }
});

router.get('/daily-itinerary', withAuth, async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findAll({
    });

    const appointments = dbAppointmentData.map((appointmentData) =>
      appointmentData.get({ plain: true })
    );
    response.render('appointment', {
      appointments,
      loggedIn: request.session.loggedIn,
    });
  } catch (error) {
    response.status(500).json(error);
  }
});

router.get('/view-appointments', withAuth, async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findAll({
    });

    const appointments = dbAppointmentData.map((appointmentData) =>
      appointmentData.get({ plain: true })
    );
    response.render('appointment', {
      appointments,
      loggedIn: request.session.loggedIn,
    });
  } catch (error) {
    response.status(500).json(error);
  }
});

router.get('/:id', async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findByPk(request.params.id, {
    });
    const appointment = dbAppointmentData.get({ plain: true });
    response.render('appointment', { appointment, loggedIn: request.session.loggedIn });
  } catch (err) {
    console.log(err);
    response.status(500).json(err);
  }
});

// Get the edit appointment page
router.get('/edit/:id', withAuth, async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findByPk(request.params.id, {
      where: {
        id: request.params.id,
      },
      attributes: [
        'id',
        'appnt_date',
        'appnt_time',
        'appnt_for_whom',
        'appnt_with_whom',
        'appnt_location',
        'appnt_note',
        'created_at',
      ],
    });
    if (!dbAppointmentData) {
      response.status(404).json({ message: 'No appointment found with that id' });
      return;
    }
    const appointment = dbAppointmentData.get({ plain: true });
    response.render('edit-post', { appointment, loggedIn: request.session.loggedIn });
  } catch (err) {
    console.log(err);
    response.status(500).json(err);
  }
});

module.exports = router;