const router = require('express').Router();
const { Appointment } = require('../models');
const withAuth = require('../utils/auth');

// Get the add new appointment page
router.get('/new', withAuth, async (request, response) => {
  try {
    const dbAppointmentSearchData = await Appointment.findAll({
      where: {
        user_id: request.session.user_id,
      },
      attributes: ['appnt_for_whom', 'appnt_with_whom', 'appnt_location']
    });

    const appointments = dbAppointmentSearchData.map((appointmentData) =>
      appointmentData.get({ plain: true })
    );

    const appointmentsForWhomUnique = [... new Set(appointments.map((appointmentData) =>
      appointmentData.appnt_for_whom
    ))];

    const appointmentsWithWhomUnique = [... new Set(appointments.map((appointmentData) =>
      appointmentData.appnt_with_whom
    ))];

    const appointmentsLocationUnique = [... new Set(appointments.map((appointmentData) =>
      appointmentData.appnt_location
    ))];
    response.render('add-new-appointment', {
      appointmentsForWhomUnique,
      appointmentsWithWhomUnique,
      appointmentsLocationUnique,
      loggedIn: request.session.loggedIn
    });
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
      where: {
        user_id: request.session.user_id,
      },
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

// Get all the appointments
router.get('/view-all-appointments', withAuth, async (request, response) => {
  try {
    const dbAppointmentData = await Appointment.findAll({
      where: {
        user_id: request.session.user_id,
      },
      order: [
        ['appnt_date', 'ASC'],
        ['appnt_time', 'ASC'],
      ],
    });

    const month = ('0' + (new Date().getMonth() + 1)).slice(-2);
    const date = ('0' + (new Date().getDate())).slice(-2);
    const today = `${new Date().getFullYear()}-${month}-${date}`;

    const dbAppointmentDataCurrent = dbAppointmentData.filter(appointments => appointments.appnt_date >= `${today}`);
    const appointments = dbAppointmentDataCurrent.map((appointmentData) =>
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

module.exports = router;