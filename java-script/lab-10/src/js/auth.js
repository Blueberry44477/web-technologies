import { 
    getToken,
    isAuthenticated,
    removeToken
} from "./utils";

const API_URL = "http://localhost:8080/api/v1"

if (isAuthenticated()) {
    window.location.replace('/app.html');
}

const dobEl = document.getElementById("reg-dob");
dobEl.value = "2000-01-01"

// Tab switching logic
const tabs = document.querySelectorAll(".tab-btn");
const forms = document.querySelectorAll(".form-container");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));
        
        tab.classList.add("active");
        document.getElementById(tab.dataset.target).classList.add("active");
    });
});

// Password visibility
document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", function() {
        const input = this.previousElementSibling;
        const iconImg = this.querySelector('img');

        if (input.type === "password") {
            input.type = "text";
            iconImg.src = 'src/assets/visibility_lock.svg';
        } else {
            input.type = "password";
            iconImg.src = 'src/assets/visibility.svg';
        }
    });
});

// Country and City dependent dropdown logic
const cityData = {
    "Ukraine": ["Kyiv", "Lviv", "Odesa", "Kharkiv"],
    "USA": ["New York", "Los Angeles", "Chicago"],
    "UK": ["London", "Manchester", "Birmingham"]
};

const countrySelect = document.getElementById("reg-country");
const citySelect = document.getElementById("reg-city");

countrySelect.addEventListener("change", function() {
    citySelect.innerHTML = '<option value="">Select City</option>';
    if (this.value) {
        citySelect.disabled = false;
        cityData[this.value].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        citySelect.disabled = true;
    }
});

const setStatus = (element, isValid) => {
    if (isValid) {
        element.classList.remove("invalid");
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
    }
};

const resetFormVisuals = (formElement) => {
    formElement.reset();
    formElement.querySelectorAll(".valid, .invalid").forEach(el => {
        el.classList.remove("valid", "invalid");
    });
};

// Signup Form Validation
const validateSignupForm = (form) => {
    let isFormValid = true;

    // First & Last Name: between 3 and 15 chars
    const validateName = (id) => {
        const el = document.getElementById(id);
        const val = el.value.trim();
        const isValid = val.length >= 3 && val.length <= 15;
        setStatus(el, isValid);
        if (!isValid) isFormValid = false;
    };
    validateName("reg-firstname");
    validateName("reg-lastname");
    
    // Email regex
    const emailEl = document.getElementById("reg-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailEl.value.trim());
    setStatus(emailEl, isEmailValid);
    if (!isEmailValid) isFormValid = false;

    // Password: min 6 chars
    const passEl = document.getElementById("reg-password");
    const isPassValid = passEl.value.length >= 6;
    setStatus(passEl, isPassValid);
    if (!isPassValid) isFormValid = false;

    // Confirm Password
    const confirmEl = document.getElementById("reg-confirm");
    const isConfirmValid = confirmEl.value === passEl.value && confirmEl.value.length >= 6;
    setStatus(confirmEl, isConfirmValid);
    if (!isConfirmValid) isFormValid = false;

    // Phone regex: +380 followed by 9 digits
    const phoneEl = document.getElementById("reg-phone");
    const phoneRegex = /^\+380\d{9}$/;
    const isPhoneValid = phoneRegex.test(phoneEl.value.trim());
    setStatus(phoneEl, isPhoneValid);
    if (!isPhoneValid) isFormValid = false;

    // Date of Birth: >= 12 years old, not future
    const dobEl = document.getElementById("reg-dob");
    let isDobValid = false;
    if (dobEl.value) {
        const dob = new Date(dobEl.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (dob <= today && age >= 12) {
            isDobValid = true;
        }
    }
    setStatus(dobEl, isDobValid);
    if (!isDobValid) isFormValid = false;

    // Sex: required
    const sexRadios = document.querySelectorAll('input[name="sex"]');
    const sexContainer = sexRadios[0].closest('div');
    let isSexSelected = Array.from(sexRadios).some(radio => radio.checked);
    if (isSexSelected) {
        sexContainer.classList.remove("invalid-radio");
    } else {
        sexContainer.classList.add("invalid-radio");
        isFormValid = false;
    }

    // Country & City
    setStatus(countrySelect, countrySelect.value !== "");
    setStatus(citySelect, citySelect.value !== "");
    if (countrySelect.value === "" || citySelect.value === "") isFormValid = false;

    return isFormValid;
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;

    if (!validateSignupForm(form)) {
        showSnackbar("Please correct the errors in the form.");
        return;
    }
    
    const signupData = {
        first_name: document.getElementById("reg-firstname").value.trim(),
        last_name: document.getElementById("reg-lastname").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        password: document.getElementById("reg-password").value,
        phone: document.getElementById("reg-phone").value.trim(),
        dob: document.getElementById("reg-dob").value,
        sex: document.querySelector('input[name="sex"]:checked').value,
        country: countrySelect.value,
        city: citySelect.value
    }

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed due to a server error.');
        }

        showSnackbar("Successfully registered!");
        resetFormVisuals(form);
        citySelect.disabled = true;

    } catch (error) {
        showSnackbar(error.message); 
    }
}

// Login Form Validation
const validateLoginForm = () => {
    let isFormValid = true;

    const userEl = document.getElementById("login-email");
    const isUserValid = userEl.value.trim().length > 0;
    setStatus(userEl, isUserValid);
    if (!isUserValid) isFormValid = false;

    const passEl = document.getElementById("login-password");
    const isPassValid = passEl.value.length >= 6;
    setStatus(passEl, isPassValid);
    if (!isPassValid) isFormValid = false;

    return isFormValid;
};

async function handleLogin(event) {

    event.preventDefault();
    const form = event.target;

    if (!validateLoginForm()) {
        showSnackbar("Please enter a valid username and password.");
        return;
    }

    const loginCredentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    }

    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginCredentials)
        })

        if (!response.ok)
            throw new Error('Invalid email or password');

        const token = await response.text();
        localStorage.setItem('token', token);

        if (isAuthenticated()) {
            showSnackbar("Login successful!");
            resetFormVisuals(form);
            setTimeout(() => {
                window.location.replace('/app.html');
            }, 1500)
        }
    } catch(error) {
        showSnackbar(error.message);
    }
}

document.getElementById('signup-form').addEventListener('submit', handleRegister);
document.getElementById('login-form').addEventListener('submit', handleLogin);

// Snackbar
function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = "show";
    
    setTimeout(() => { 
        snackbar.className = snackbar.className.replace("show", ""); 
    }, 3000);
}