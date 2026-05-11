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
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
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

// Validation functions
const setStatus = (element, isValid) => {
    if (isValid) {
        element.classList.remove("invalid");
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
    }
};

// Signup Form Validation
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
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

    if (isFormValid) {
        alert("Signup successful!");
        this.reset();
        this.querySelectorAll(".valid").forEach(el => el.classList.remove("valid"));
        citySelect.disabled = true;
    }
});

// Login Form Validation
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let isFormValid = true;

    const userEl = document.getElementById("login-username");
    const isUserValid = userEl.value.trim().length > 0;
    setStatus(userEl, isUserValid);
    if (!isUserValid) isFormValid = false;

    const passEl = document.getElementById("login-password");
    const isPassValid = passEl.value.length >= 6;
    setStatus(passEl, isPassValid);
    if (!isPassValid) isFormValid = false;

    if (isFormValid) {
        alert("Login successful!");
        this.reset();
        this.querySelectorAll(".valid").forEach(el => el.classList.remove("valid"));
    }
});