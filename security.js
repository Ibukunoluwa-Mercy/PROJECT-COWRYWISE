import { getUserData, setUserData, isLoggedIn, getUserProfile, setUserProfile } from './auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXrI6w4SUZSvQKwOLhEKQgBJP4_IIVG4U",
    authDomain: "project-cowrywise.firebaseapp.com",
    projectId: "project-cowrywise",
    storageBucket: "project-cowrywise.firebasestorage.app",
    messagingSenderId: "941775035575",
    appId: "1:941775035575:web:641bec9ad2778b5b214132"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


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

    // Password Change Modal Logic
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
            // Reset form state
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
            const user = auth.currentUser;

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

            errorDiv.style.display = 'none';
            const originalBtnText = savePasswordChangeBtn.textContent;
            savePasswordChangeBtn.textContent = 'Saving...';
            savePasswordChangeBtn.disabled = true;

            const credential = EmailAuthProvider.credential(user.email, oldPassword);

            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, newPassword).then(() => {
                    setTimeout(() => {
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

                        // Get current user's email from the authenticated user object
                        const userEmail = user.email;

                        // Update the password in the general 'userData' for the current session
                        const sessionUserData = getUserData();
                        if (sessionUserData.password) {
                            sessionUserData.password = newPassword;
                            setUserData(sessionUserData);
                        }

                        // Update the password in the user's specific profile for persistence
                        if (userEmail) {
                            const userProfile = getUserProfile(userEmail);
                            if (Object.keys(userProfile).length > 0 && 'password' in userProfile) {
                                userProfile.password = newPassword;
                                setUserProfile(userEmail, userProfile);
                            }
                        }

                        closePasswordModal();
                        savePasswordChangeBtn.textContent = originalBtnText;
                        savePasswordChangeBtn.disabled = false;
                    }, 2000);
                }).catch((error) => {
                    errorDiv.textContent = `Error updating password: ${error.message}`;
                    errorDiv.style.display = 'block';
                    savePasswordChangeBtn.textContent = originalBtnText;
                    savePasswordChangeBtn.disabled = false;
                });
            }).catch((error) => {
                errorDiv.textContent = `Authentication failed. Please check your current password.`;
                errorDiv.style.display = 'block';
                savePasswordChangeBtn.textContent = originalBtnText;
                savePasswordChangeBtn.disabled = false;
            });
        });
    }
});