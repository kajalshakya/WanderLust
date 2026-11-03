// Enable strict mode to catch common JavaScript errors
(() => {
    'use strict';

    // Select all forms with the needs-validation class
    const forms = document.querySelectorAll('.needs-validation');

    // Apply validation to each selected form
    forms.forEach((form) => {

        // Add a submit event listener to the form
        form.addEventListener('submit', (event) => {

            // Check whether the form fields satisfy validation rules
            if (!form.checkValidity()) {

                // Prevent form submission if validation fails
                event.preventDefault();

                // Stop the event from propagating further
                event.stopPropagation();
            }

            // Add Bootstrap's was-validated class to display validation feedback
            form.classList.add('was-validated');
        });
    });
})();