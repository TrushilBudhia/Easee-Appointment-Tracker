const body = document.querySelector("body");
body.setAttribute("style", "display: block;");

// Adding the flatpickr Date Picker to the appointment date input
flatpickr("#appointment-date", {
    altInput: true,
    altFormat: "j F Y",
    dateFormat: "Y-m-d",
    minDate: "today",
});
// Adding the flatpickr Time Picker to the appointment time input
flatpickr("#appointment-time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    minTime: "08:00",
    time_24hr: true
});

// Once the user submits their update, a success message will be display with a link to take them back to the dashboard
const successMessage = async () => {
    document.querySelector(".appointment-details").setAttribute("class", "appointment-details box is-block mx-3 is-hidden");
    let successMessageSection = document.querySelector(".success-message");
    successMessageSection.setAttribute("class", "success-message box is-block has-text-centered mx-3 notification is-success");
}

// Directs user to particular page depending on the button they click
document.querySelector(".new-appointment").addEventListener("click", async (event) => {
    event.preventDefault();
    document.location.replace('/appointment/new');
})
document.querySelector(".dashboard").addEventListener("click", async (event) => {
    event.preventDefault();
    document.location.replace('/dashboard');
})

// VARIABLES
const appointmentDate = document.querySelector('#appointment-date');
const appointmentForInput = document.getElementById("appointment-for");
const appointmentWithInput = document.getElementById("appointment-with");
const addressInput = document.getElementById("appointment-location");
const appointmentNotes = document.getElementById("appointment-notes");
const submitAppointmentEntryButton = document.querySelector("#submit-appointment-button");

// Prevents duplication of elements - e.g. error message
const numberOfElementsShown = async (elementSelect, numberOfElements) => {
    if (elementSelect.length > numberOfElements) {
        for (i = 0; i < elementSelect.length - numberOfElements; i++) {
            elementSelect[i].remove();
        }
    }
}

// Begins appointment entry process once the new appointment page loads
const init = async () => {
    appointmentForInput.value = "";
    appointmentWithInput.value = "";
    addressInput.value = "";
    appointmentNotes.value = "";
    submitAppointmentEntryButton.addEventListener("click", addAppointmentFormHandler);
}

const addAppointmentFormHandler = async (event) => {
    event.preventDefault();

    const time = document.querySelector('#appointment-time').value.trim();
    const hour = time.slice(0, 2);
    const minute = time.slice(3, 5);
    const appointmentTimeNew = `${hour}${minute}`;

    const appointmentDate = appointmentDate.value.trim();
    const appointmentTime = appointmentTimeNew;
    const appointmentFor = appointmentForInput.value.trim();
    const appointmentWith = appointmentWithInput.value.trim();
    const appointmentLocation = addressInput.value.trim();
    const appointmentNotes = appointmentNotes.value.trim();
    // Posting the data to the api/appointments router when the submit button is successfully submitted
    if (appointmentDate && appointmentTime && appointmentFor && appointmentWith && appointmentLocation) {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            body: JSON.stringify({ appointmentDate, appointmentTime, appointmentFor, appointmentWith, appointmentLocation, appointmentNotes }),
            headers: { 'Content-Type': 'application/json' },
        });
        // Invoke the successMessage function if the response is ok
        if (response.ok) {
            successMessage();
        } else {
            const error = `<p>*Failed to create appointment</p>`;
            document.querySelector('.error-message').innerHTML = error;
            alert(response.statusText);
        }
    } else {
        const errorMessage = document.querySelector(".error");
        numberOfElementsShown(errorMessage, 0);
        let errorMessageListItem;
        if (!appointmentFor) {
            errorMessageListItem ? errorMessageListItem = errorMessageListItem + `<li>• Appointment For</li>`: errorMessageListItem = `<li>• Appointment For Whom</li>`;
        }
        if (!appointmentWith) {
            errorMessageListItem ? errorMessageListItem = errorMessageListItem + `<li>• Appointment With</li>` : errorMessageListItem = `<li>• Appointment With</li>`;
        }
        if (!appointmentLocation) {
            errorMessageListItem ? errorMessageListItem = errorMessageListItem + `<li>• Appointment Location</li>`: errorMessageListItem = `<li>• Appointment Location</li>`;
        }

        const errorMessageSection = document.querySelector('.error-message');
        errorMessageSection.setAttribute('class', 'error-message notification is-danger my-4 is-block');
        errorMessage.innerHTML = errorMessageListItem;
    }
}

init();