import { isLoggedIn, getUserData, setUserData, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {

    // Redirect if not logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Setup logout
    const logoutItem = document.getElementById('logoutItem');
    if (logoutItem) {
        logoutItem.addEventListener('click', (e) => {
            e.stopPropagation();
            logout();
        });
    }

    const userProfileBtn = document.getElementById('userProfileBtn');
    const logoutDropdown = document.getElementById('logoutDropdown');
    if (userProfileBtn && logoutDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            logoutDropdown.style.display = logoutDropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            logoutDropdown.style.display = 'none';
        });
    }

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Load user data from auth.js helper (reads 'userData' key)
    const existingData = getUserData();

    // --- Greeting ---
    const greetingEl = document.getElementById('greetingName');
    if (greetingEl && existingData.firstName) {
        greetingEl.innerHTML = `Go <strong>${existingData.firstName}</strong>`;
    }

    // --- Full name display ---
    const userFullNameContainer = document.querySelector('.user-full-name');
    if (userFullNameContainer) {
        let fullName = '';
        if (existingData.displayName) {
            fullName = existingData.displayName;
        } else if (existingData.firstName && existingData.lastName) {
            fullName = `${existingData.firstName} ${existingData.lastName}`;
        } else if (existingData.firstName) {
            fullName = existingData.firstName;
        } else if (existingData.email) {
            fullName = existingData.email.split('@')[0];
        }
        userFullNameContainer.textContent = fullName || 'User';
    }

    // --- Avatar: show Google photo or uploaded photo ---
    const avatarContainer = document.querySelector('.avatar-large');
    const profileAvatarImg = document.getElementById('profileAvatar');
    const avatarUploadInput = document.getElementById('avatarUpload');

    if (profileAvatarImg && existingData.profileAvatar) {
        profileAvatarImg.src = existingData.profileAvatar;
    }

    if (avatarContainer) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', () => {
            if (avatarUploadInput) avatarUploadInput.click();
        });
    }

    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && profileAvatarImg) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newAvatarSrc = e.target.result;
                    profileAvatarImg.src = newAvatarSrc;
                    existingData.profileAvatar = newAvatarSrc;
                    setUserData(existingData);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Email display ---
    const emailDisplay = document.getElementById('emailDisplay');
    if (emailDisplay) {
        emailDisplay.textContent = existingData.email || 'Not provided';
    }

    // --- Username ---
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        const derivedUsername = existingData.email
            ? '@' + existingData.email.split('@')[0].toLowerCase()
            : '@user';
        usernameInput.value = existingData.username || derivedUsername;
    }

    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn && usernameInput) {
        saveBtn.addEventListener('click', () => {
            existingData.username = usernameInput.value;
            setUserData(existingData);
            saveBtn.textContent = 'Saved!';
            setTimeout(() => saveBtn.textContent = 'Save Changes', 2000);
        });
    }

    // --- Next of Kin ---
    const nokDisplay = document.getElementById('nokDisplay');
    const nokInputGroup = document.getElementById('nokInputGroup');
    const nokInput = document.getElementById('nokInput');
    const nokBtn = document.getElementById('nokBtn');

    if (nokDisplay && existingData.nextOfKin) {
        nokDisplay.textContent = existingData.nextOfKin;
        nokDisplay.classList.remove('text-muted');
        if (nokBtn) nokBtn.textContent = 'Edit';
    }

    if (nokBtn) {
        nokBtn.addEventListener('click', () => {
            if (nokBtn.textContent === 'Add Next Of Kin' || nokBtn.textContent === 'Edit') {
                nokDisplay.style.display = 'none';
                nokInputGroup.style.display = 'block';
                nokInput.value = existingData.nextOfKin || '';
                nokBtn.textContent = 'Save';
            } else if (nokBtn.textContent === 'Save') {
                const newVal = nokInput.value.trim();
                if (newVal) {
                    existingData.nextOfKin = newVal;
                    setUserData(existingData);
                    nokDisplay.textContent = newVal;
                    nokDisplay.classList.remove('text-muted');
                    nokBtn.textContent = 'Edit';
                } else {
                    existingData.nextOfKin = '';
                    setUserData(existingData);
                    nokDisplay.textContent = 'No Next Of Kin';
                    nokDisplay.classList.add('text-muted');
                    nokBtn.textContent = 'Add Next Of Kin';
                }
                nokDisplay.style.display = 'block';
                nokInputGroup.style.display = 'none';
            }
        });
    }

    // --- Gender ---
    const genderDisplay = document.getElementById('genderDisplay');
    const genderInputGroup = document.getElementById('genderInputGroup');
    const genderInput = document.getElementById('genderInput');
    const genderBtn = document.getElementById('genderBtn');

    if (genderDisplay) {
        genderDisplay.textContent = existingData.gender || 'Not set';
        if (!existingData.gender) genderDisplay.classList.add('text-muted');
    }
    if (genderBtn) genderBtn.textContent = existingData.gender ? 'Edit' : 'Add Gender';

    if (genderBtn) {
        genderBtn.addEventListener('click', () => {
            if (genderBtn.textContent === 'Add Gender' || genderBtn.textContent === 'Edit') {
                genderDisplay.style.display = 'none';
                genderInputGroup.style.display = 'block';
                genderInput.value = existingData.gender || 'Female';
                genderBtn.textContent = 'Save';
            } else if (genderBtn.textContent === 'Save') {
                const newVal = genderInput.value;
                if (newVal) {
                    existingData.gender = newVal;
                    setUserData(existingData);
                    genderDisplay.textContent = newVal;
                    genderDisplay.classList.remove('text-muted');
                    genderBtn.textContent = 'Edit';
                }
                genderDisplay.style.display = 'block';
                genderInputGroup.style.display = 'none';
            }
        });
    }

    // --- Date of Birth ---
    const dobDisplay = document.getElementById('dobDisplay');
    const dobInputGroup = document.getElementById('dobInputGroup');
    const dobInput = document.getElementById('dobInput');
    const dobBtn = document.getElementById('dobBtn');

    if (dobDisplay) {
        dobDisplay.textContent = existingData.dob || 'Not provided';
        if (!existingData.dob) dobDisplay.classList.add('text-muted');
    }
    if (dobBtn) dobBtn.textContent = existingData.dob ? 'Edit' : 'Add Date of Birth';

    if (dobBtn) {
        dobBtn.addEventListener('click', () => {
            if (dobBtn.textContent === 'Add Date of Birth' || dobBtn.textContent === 'Edit') {
                dobDisplay.style.display = 'none';
                dobInputGroup.style.display = 'block';
                dobInput.value = existingData.dob || '';
                dobBtn.textContent = 'Save';
            } else if (dobBtn.textContent === 'Save') {
                const newVal = dobInput.value;
                if (newVal) {
                    existingData.dob = newVal;
                    setUserData(existingData);
                    dobDisplay.textContent = newVal;
                    dobDisplay.classList.remove('text-muted');
                    dobBtn.textContent = 'Edit';
                } else {
                    existingData.dob = '';
                    setUserData(existingData);
                    dobDisplay.textContent = 'Not provided';
                    dobDisplay.classList.add('text-muted');
                    dobBtn.textContent = 'Add Date of Birth';
                }
                dobDisplay.style.display = 'block';
                dobInputGroup.style.display = 'none';
            }
        });
    }

    // --- Account Visibility toggle ---
    const visibilityToggle = document.getElementById('visibilityToggle');
    const savedVisibility = localStorage.getItem('accountVisibility');
    if (visibilityToggle) {
        if (savedVisibility !== null) {
            visibilityToggle.checked = savedVisibility === 'true';
        }
        visibilityToggle.addEventListener('change', (e) => {
            localStorage.setItem('accountVisibility', e.target.checked);
        });
    }

    // --- Profile completion card fade ---
    const completionCard = document.querySelector('.profile-completion-card');
    if (completionCard) {
        setTimeout(() => {
            completionCard.style.transition = 'opacity 0.5s ease';
            completionCard.style.opacity = '0';
            setTimeout(() => {
                completionCard.style.display = 'none';
            }, 500);
        }, 3000);
    }

    // --- Theme switcher ---
    const themeSystem = document.getElementById('themeSystem');
    const themeDay    = document.getElementById('themeDay');
    const themeNight  = document.getElementById('themeNight');
    const themeOptions = [themeSystem, themeDay, themeNight];

    function applyTheme(theme) {
        localStorage.setItem('appTheme', theme);
        if (theme === 'night') {
            document.documentElement.classList.add('dark-theme');
        } else if (theme === 'day') {
            document.documentElement.classList.remove('dark-theme');
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark-theme');
            } else {
                document.documentElement.classList.remove('dark-theme');
            }
        }
        themeOptions.forEach(btn => btn && btn.classList.remove('active'));
        const map = { system: themeSystem, day: themeDay, night: themeNight };
        if (map[theme]) map[theme].classList.add('active');
    }

    const savedTheme = localStorage.getItem('appTheme') || 'system';
    applyTheme(savedTheme);

    if (themeSystem) themeSystem.addEventListener('click', () => applyTheme('system'));
    if (themeDay)    themeDay.addEventListener('click',    () => applyTheme('day'));
    if (themeNight)  themeNight.addEventListener('click',  () => applyTheme('night'));
});