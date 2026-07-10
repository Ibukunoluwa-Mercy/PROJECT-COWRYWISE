document.addEventListener('DOMContentLoaded', () => {

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    const existingData = JSON.parse(localStorage.getItem('userData')) || {};
    if (existingData.firstName) {
        document.getElementById('greetingName').innerHTML = `Go <strong>${existingData.firstName}</strong>`;
    }

    if (existingData.email) {
        const displayEmail = document.getElementById('displayEmail');
        if (displayEmail) displayEmail.textContent = existingData.email;
    }


    const phoneDisplay = document.getElementById('phoneDisplay');
    const editPhoneBtn = document.getElementById('editPhoneBtn');
    const addPhoneBtn = document.getElementById('addPhoneBtn');
    const phoneInputGroup = document.getElementById('phoneInputGroup');
    const phoneInput = document.getElementById('phoneInput');
    const savePhoneBtn = document.getElementById('savePhoneBtn');

    if (existingData.phone) {
        if (addPhoneBtn) addPhoneBtn.style.display = 'none';
        if (phoneDisplay) {
            phoneDisplay.style.display = 'block';
            phoneDisplay.textContent = existingData.phone;
        }
        if (editPhoneBtn) editPhoneBtn.style.display = 'block';
    }

    if (addPhoneBtn) {
        addPhoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addPhoneBtn.style.display = 'none';
            phoneInputGroup.style.display = 'flex';
        });
    }

    if (editPhoneBtn) {
        editPhoneBtn.addEventListener('click', () => {
            phoneDisplay.style.display = 'none';
            editPhoneBtn.style.display = 'none';
            phoneInputGroup.style.display = 'flex';
            phoneInput.value = existingData.phone || '';
        });
    }

    if (savePhoneBtn) {
        savePhoneBtn.addEventListener('click', () => {
            const val = phoneInput.value.trim();
            if (val) {
                existingData.phone = val;
                localStorage.setItem('userData', JSON.stringify(existingData));
                phoneInputGroup.style.display = 'none';
                phoneDisplay.style.display = 'block';
                phoneDisplay.textContent = val;
                editPhoneBtn.style.display = 'block';
                if (addPhoneBtn) addPhoneBtn.style.display = 'none';
            }
        });
    }


    const addNinBtn = document.getElementById('addNinBtn');
    const ninInputGroup = document.getElementById('ninInputGroup');
    const ninInput = document.getElementById('ninInput');
    const saveNinBtn = document.getElementById('saveNinBtn');
    const ninDisplay = document.getElementById('ninDisplay');

    if (existingData.nin) {
        addNinBtn.style.display = 'none';
        ninDisplay.style.display = 'block';
        ninDisplay.textContent = existingData.nin;
    }

    if (addNinBtn) {
        addNinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNinBtn.style.display = 'none';
            ninInputGroup.style.display = 'flex';
        });
    }

    if (saveNinBtn) {
        saveNinBtn.addEventListener('click', () => {
            const val = ninInput.value.trim();
            if (val) {
                existingData.nin = val;
                localStorage.setItem('userData', JSON.stringify(existingData));
                ninInputGroup.style.display = 'none';
                ninDisplay.style.display = 'block';
                ninDisplay.textContent = val;
            }
        });
    }


    const addBvnBtn = document.getElementById('addBvnBtn');
    const bvnInputGroup = document.getElementById('bvnInputGroup');
    const bvnInput = document.getElementById('bvnInput');
    const saveBvnBtn = document.getElementById('saveBvnBtn');
    const bvnDisplay = document.getElementById('bvnDisplay');

    if (existingData.bvn) {
        addBvnBtn.style.display = 'none';
        bvnDisplay.style.display = 'block';
        bvnDisplay.textContent = '***' + existingData.bvn.slice(-4); // mask bvn
    }

    if (addBvnBtn) {
        addBvnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addBvnBtn.style.display = 'none';
            bvnInputGroup.style.display = 'flex';
        });
    }

    if (saveBvnBtn) {
        saveBvnBtn.addEventListener('click', () => {
            const val = bvnInput.value.trim();
            if (val) {
                existingData.bvn = val;
                localStorage.setItem('userData', JSON.stringify(existingData));
                bvnInputGroup.style.display = 'none';
                bvnDisplay.style.display = 'block';
                bvnDisplay.textContent = '***' + val.slice(-4);
            }
        });
    }


    const tfaToggle = document.getElementById('tfaToggle');
    const savedTfa = localStorage.getItem('accountTfa');
    if (savedTfa !== null && tfaToggle) {
        tfaToggle.checked = savedTfa === 'true';
    }
    if (tfaToggle) {
        tfaToggle.addEventListener('change', (e) => {
            localStorage.setItem('accountTfa', e.target.checked);
        });
    }


    const disableAccountBtn = document.getElementById('disableAccountBtn');
    const closeAccountBtn = document.getElementById('closeAccountBtn');

    if (disableAccountBtn) {
        disableAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to temporarily disable your account? You won't be able to log in for 5 minutes.")) {
                if (existingData.email) {
                    localStorage.setItem('disabledAccountEmail', existingData.email);
                    localStorage.setItem('disabledAccountTime', Date.now().toString());
                }
                localStorage.removeItem('userData'); // "Delete" the account data locally
                window.location.href = 'login.html';
            }
        });
    }

    if (closeAccountBtn) {
        closeAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to permanently close your account? This action cannot be undone.")) {
                localStorage.clear(); // Clear everything
                window.location.href = 'createaccount.html';
            }
        });
    }

});