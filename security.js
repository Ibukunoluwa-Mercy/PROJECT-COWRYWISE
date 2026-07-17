import { isLoggedIn, getUserData, setUserData, getUserProfile, setUserProfile, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {

    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
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

    const logoutItem = document.getElementById('logoutItem');
    if (logoutItem) {
        logoutItem.addEventListener('click', (e) => {
            e.stopPropagation();
            logout();
        });
    }

    const existingData = getUserData();
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
                setUserData(existingData);
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
                setUserData(existingData);
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
        bvnDisplay.textContent = '***' + existingData.bvn.slice(-4);
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
                setUserData(existingData);
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
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }
        });
    }

    if (closeAccountBtn) {
        closeAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to permanently close your account? This action cannot be undone.")) {
                localStorage.clear();
                window.location.href = 'createaccount.html';
            }
        });
    }


    const passwordChangeModal = document.getElementById('passwordChangeModal');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordModalClose = document.getElementById('passwordModalClose');
    const passwordModalCancel = document.getElementById('passwordModalCancel');
    const savePasswordChangeBtn = document.getElementById('savePasswordChangeBtn');

    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const errorDiv = document.getElementById('passwordChangeError');

    const openPasswordModal = () => {
        if (passwordChangeModal) {
            passwordChangeModal.hidden = false;
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            oldPasswordInput.focus();
        }
    };

    const closePasswordModal = () => {
        if (passwordChangeModal) {
            passwordChangeModal.hidden = true;
        }
    };

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordModal);
    }
    if (passwordModalClose) {
        passwordModalClose.addEventListener('click', closePasswordModal);
    }
    if (passwordModalCancel) {
        passwordModalCancel.addEventListener('click', closePasswordModal);
    }

    if (savePasswordChangeBtn) {
        savePasswordChangeBtn.addEventListener('click', () => {
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (!oldPassword || !newPassword || !confirmNewPassword) {
                errorDiv.textContent = "All fields are required.";
                errorDiv.style.display = 'block';
                return;
            }
            if (newPassword.length < 6) {
                errorDiv.textContent = "New password must be at least 6 characters long.";
                errorDiv.style.display = 'block';
                return;
            }
            if (newPassword !== confirmNewPassword) {
                errorDiv.textContent = "New passwords do not match.";
                errorDiv.style.display = 'block';
                return;
            }

            const storedUser = getUserData();
            if (!storedUser.password || storedUser.password !== oldPassword) {
                errorDiv.textContent = "Current password is incorrect.";
                errorDiv.style.display = 'block';
                return;
            }

            errorDiv.style.display = 'none';
            const originalBtnText = savePasswordChangeBtn.textContent;
            savePasswordChangeBtn.textContent = 'Saving...';
            savePasswordChangeBtn.disabled = true;

            setTimeout(() => {
                storedUser.password = newPassword;
                setUserData(storedUser);

                Toastify({
                    text: "✅ Password updated successfully!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00d18b, #00b09b)",
                        borderRadius: "8px",
                    },
                }).showToast();

                closePasswordModal();
                savePasswordChangeBtn.textContent = originalBtnText;
                savePasswordChangeBtn.disabled = false;
            }, 800);
        });
    }



    const pinChangeModal = document.getElementById('pinChangeModal');
    const changePinBtn = document.getElementById('changePinBtn');
    const pinModalClose = document.getElementById('pinModalClose');
    const pinModalCancel = document.getElementById('pinModalCancel');
    const savePinChangeBtn = document.getElementById('savePinChangeBtn');
    const pinErrorDiv = document.getElementById('pinChangeError');

    const oldPinInputs = document.querySelectorAll('#oldPinRow .pin-dot-input');
    const newPinInputs = document.querySelectorAll('#newPinRow .pin-dot-input');
    const confirmPinInputs = document.querySelectorAll('#confirmPinRow .pin-dot-input');

    function getPinValue(inputs) {
        return Array.from(inputs).map(i => i.value).join('');
    }

    function clearPinRow(inputs) {
        inputs.forEach(i => {
            i.value = '';
            i.classList.remove('filled');
        });
    }

    function setupPinDotInputs(inputs, nextRowInputs) {
        inputs.forEach((input, idx) => {
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                if (!/^[0-9]$/.test(val)) {
                    e.target.value = '';
                    e.target.classList.remove('filled');
                    return;
                }
                e.target.classList.add('filled');
                if (idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                } else if (nextRowInputs) {
                    nextRowInputs[0].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (e.target.value === '') {
                        if (idx > 0) {
                            inputs[idx - 1].value = '';
                            inputs[idx - 1].classList.remove('filled');
                            inputs[idx - 1].focus();
                        }
                    } else {
                        e.target.value = '';
                        e.target.classList.remove('filled');
                    }
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft' && idx > 0) {
                    inputs[idx - 1].focus();
                } else if (e.key === 'ArrowRight' && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, inputs.length);
                digits.split('').forEach((d, i) => {
                    if (inputs[i]) {
                        inputs[i].value = d;
                        inputs[i].classList.add('filled');
                    }
                });
                const lastIdx = Math.min(digits.length - 1, inputs.length - 1);
                inputs[lastIdx] && inputs[lastIdx].focus();
            });
        });
    }

    setupPinDotInputs(oldPinInputs, newPinInputs);
    setupPinDotInputs(newPinInputs, confirmPinInputs);
    setupPinDotInputs(confirmPinInputs, null);

    const openPinModal = () => {
        if (pinChangeModal) {
            clearPinRow(oldPinInputs);
            clearPinRow(newPinInputs);
            clearPinRow(confirmPinInputs);
            pinErrorDiv.style.display = 'none';
            pinErrorDiv.textContent = '';
            pinChangeModal.hidden = false;
            oldPinInputs[0].focus();
        }
    };

    const closePinModal = () => {
        if (pinChangeModal) {
            pinChangeModal.hidden = true;
        }
    };

    if (changePinBtn) changePinBtn.addEventListener('click', openPinModal);
    if (pinModalClose) pinModalClose.addEventListener('click', closePinModal);
    if (pinModalCancel) pinModalCancel.addEventListener('click', closePinModal);

    if (pinChangeModal) {
        pinChangeModal.addEventListener('click', (e) => {
            if (e.target === pinChangeModal) closePinModal();
        });
    }
    if (passwordChangeModal) {
        passwordChangeModal.addEventListener('click', (e) => {
            if (e.target === passwordChangeModal) closePasswordModal();
        });
    }

    if (savePinChangeBtn) {
        savePinChangeBtn.addEventListener('click', () => {
            const oldPin = getPinValue(oldPinInputs);
            const newPin = getPinValue(newPinInputs);
            const confirmPin = getPinValue(confirmPinInputs);

            if (oldPin.length < 4 || newPin.length < 4 || confirmPin.length < 4) {
                pinErrorDiv.textContent = "Please fill in all PIN fields (4 digits each).";
                pinErrorDiv.style.display = 'block';
                return;
            }

            const storedUser = getUserData();
            if (!storedUser.pin || storedUser.pin !== oldPin) {
                pinErrorDiv.textContent = "Current PIN is incorrect.";
                pinErrorDiv.style.display = 'block';
                clearPinRow(oldPinInputs);
                oldPinInputs[0].focus();
                return;
            }

            if (newPin !== confirmPin) {
                pinErrorDiv.textContent = "New PINs do not match. Please try again.";
                pinErrorDiv.style.display = 'block';
                clearPinRow(newPinInputs);
                clearPinRow(confirmPinInputs);
                newPinInputs[0].focus();
                return;
            }

            pinErrorDiv.style.display = 'none';
            const originalBtnText = savePinChangeBtn.textContent;
            savePinChangeBtn.textContent = 'Saving...';
            savePinChangeBtn.disabled = true;

            setTimeout(() => {
                storedUser.pin = newPin;
                setUserData(storedUser);

                Toastify({
                    text: "🔒 PIN updated successfully!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #0066f5, #00d18b)",
                        borderRadius: "8px",
                    },
                }).showToast();

                closePinModal();
                savePinChangeBtn.textContent = originalBtnText;
                savePinChangeBtn.disabled = false;
            }, 800);
        });
    }
});