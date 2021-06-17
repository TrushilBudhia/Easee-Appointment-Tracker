const successMessage = async () => {
    document.querySelector(".appointment-date").setAttribute("class", "appointment-date box is-block mx-3 is-hidden");
    let successMessageSection = document.querySelector(".success-message");
    successMessageSection.setAttribute("class", "success-message box is-block has-text-centered mx-3 notification is-success");
}

// Directs user to dashboard page when button clicked
document.querySelector(".dashboard").addEventListener("click", async (event) => {
    event.preventDefault();
    document.location.replace('/dashboard');
})

const editAppointmentHandler = async (event) => {
    event.preventDefault();

    const appointmentDate = document.querySelector('#appointment-date').value.trim();
    const appointmentTime = document.querySelector('#appointment-time').value.trim();
    const appointmentFor = document.querySelector('#appointment-for').value.trim();
    const appointmentWith = document.querySelector('#appointment-with').value.trim();
    const appointmentLocation = document.querySelector('#appointment-location').value.trim();
    const appointmentNotes = document.querySelector('#appointment-notes').value.trim();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (appointmentDate && appointmentTime && appointmentFor && appointmentWith && appointmentLocation) {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ appointmentDate, appointmentTime, appointmentFor, appointmentWith, appointmentLocation, appointmentNotes }),
            headers: { 'Content-Type': 'application/json' },
        });
        // Redirecting user to the dashboard if response is ok
        if (response.ok) {
            successMessage();
        } else {
            const error = `<p>*Failed to edit appointment</p>`;
            document.querySelector('.error-message').innerHTML = error;
            alert(response.statusText);
        }
    } 
    // else {
    //     const appointmentDateRequirement = document.querySelector('#appointment-date').placeholder = 'A date is required before submitting';
    //     const appointmentTimeRequirement = document.querySelector('#appointment-time').placeholder = 'A time is required before submitting';
    //     const appointmentForWhomRequirement = document.querySelector('#appointment-for').placeholder = 'Appointment For is required before submitting';
    //     const appointmentWithWhomRequirement = document.querySelector('#appointment-with').placeholder = 'Appointment With is required before submitting';
    //     const appointmentLocationRequirement = document.querySelector('#appointment-location').placeholder = 'Appointment Location is required before submitting';

    //     if (!appointmentDate && !appointmentTime && !appointmentForWhom && !appointmentWithWhom && !appointmentLocation) {
    //         appointmentDateRequirement;
    //         appointmentTimeRequirement;
    //         appointmentForWhomRequirement;
    //         appointmentWithWhomRequirement;
    //         appointmentLocationRequirement;
    //     } else if (!appointmentDate && !appointmentTime && !appointmentForWhom && !appointmentWithWhom) {
    //         appointmentDateRequirement;
    //         appointmentTimeRequirement;
    //         appointmentForWhomRequirement;
    //         appointmentWithWhomRequirement;
    //     } else if (!appointmentDate && !appointmentTime && !appointmentForWhom) {
    //         appointmentDateRequirement;
    //         appointmentTimeRequirement;
    //         appointmentForWhomRequirement;
    //     } else if (!appointmentDate && !appointmentTime) {
    //         appointmentDateRequirement;
    //         appointmentTimeRequirement;
    //     } else if (!appointmentDate) {
    //         appointmentDateRequirement
    //     } else if (!appointmentTime) {
    //         appointmentTimeRequirement
    //     } else if (!appointmentForWhom) {
    //         appointmentForWhomRequirement
    //     } else if (!appointmentWithWhom) {
    //         appointmentWithWhomRequirement
    //     } else if (!appointmentLocation) {
    //         appointmentLocationRequirement
    //     }
    // };
};

// When the user clicks the edit appointment button, the editAppointmentHandler will be called
document.querySelector('#edit-appointment-button').addEventListener('click', editAppointmentHandler);
