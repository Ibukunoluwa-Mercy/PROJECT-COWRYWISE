import { isLoggedIn, getUserData, setUserData, getUserProfile, setUserProfile, logout } from './auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Firebase configuration
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

/* ── Helper: save data and also sync to user-specific profile key ── */
function saveData(data) {
    setUserData(data);
    if (data.email) {
        setUserProfile(data.email, data);
    }
}

/* ── Styled confirm modal (replaces browser confirm()) ── */
function securityConfirm(title, body, confirmLabel, isDanger, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(5,15,34,0.55);
        backdrop-filter:blur(10px);z-index:99999;
        display:flex;align-items:center;justify-content:center;
        animation:scFadeIn .2s ease;
    `;
    overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;padding:32px 28px;
            width:min(90%,400px);box-shadow:0 24px 60px rgba(0,0,0,.18);
            animation:scSlideIn .22s cubic-bezier(.16,1,.3,1);">
            <h3 style="color:#0a2e65;font-size:1.1rem;font-weight:800;margin:0 0 10px">${title}</h3>
            <p style="color:#8fa0b9;font-size:14px;line-height:1.6;margin:0 0 24px">${body}</p>
            <div style="display:flex;gap:10px;justify-content:flex-end">
                <button id="scCancel" style="padding:10px 20px;border-radius:50px;border:none;
                    background:#e2e8f0;color:#334155;font-weight:700;cursor:pointer;">Cancel</button>
                <button id="scConfirm" style="padding:10px 22px;border-radius:50px;border:none;
                    background:${isDanger ? '#ef4444' : '#0066f5'};
                    color:#fff;font-weight:700;cursor:pointer;">${confirmLabel}</button>
            </div>
        </div>
        <style>
            @keyframes scFadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes scSlideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        </style>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#scCancel').onclick  = () => overlay.remove();
    overlay.querySelector('#scConfirm').onclick = () => { overlay.remove(); onConfirm(); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

const initSecurity = () => {

    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    /* ── Hamburger ── */
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    /* ── Profile dropdown ── */
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

    /* ── Populate greeting ── */
    const existingData = getUserData();

    const greetingNameEl = document.getElementById('greetingName');
    if (greetingNameEl && existingData.firstName) {
        greetingNameEl.innerHTML = `Go <strong>${existingData.firstName}</strong>`;
    }
    const displayEmail = document.getElementById('displayEmail');
    if (displayEmail && existingData.email) {
        displayEmail.textContent = existingData.email;
    }

    /* ── Google users: hide Change Password button ── */
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn && existingData.authProvider === 'google') {
        const note = document.createElement('p');
        note.textContent = 'You signed in with Google — password is managed by your Google account.';
        note.style.cssText = 'font-size: 13px; color: #888; margin: 0;';
        changePasswordBtn.replaceWith(note);
    }

    /* ════════════════════════════════════════════
       PHONE NUMBER
    ════════════════════════════════════════════ */
    const phoneDisplay    = document.getElementById('phoneDisplay');
    const editPhoneBtn    = document.getElementById('editPhoneBtn');
    const addPhoneBtn     = document.getElementById('addPhoneBtn');
    const phoneInputGroup = document.getElementById('phoneInputGroup');
    const phoneInput      = document.getElementById('phoneInput');
    const savePhoneBtn    = document.getElementById('savePhoneBtn');

    // Pre-fill if already saved
    if (existingData.phone) {
        if (addPhoneBtn)  addPhoneBtn.style.display  = 'none';
        if (phoneDisplay) { phoneDisplay.style.display = 'block'; phoneDisplay.textContent = existingData.phone; }
        if (editPhoneBtn) editPhoneBtn.style.display = 'block';
    }

    if (addPhoneBtn) {
        addPhoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addPhoneBtn.style.display = 'none';
            if (phoneInputGroup) phoneInputGroup.style.display = 'flex';
            if (phoneInput) phoneInput.focus();
        });
    }

    if (editPhoneBtn) {
        editPhoneBtn.addEventListener('click', () => {
            if (phoneDisplay)    phoneDisplay.style.display    = 'none';
            if (editPhoneBtn)    editPhoneBtn.style.display    = 'none';
            if (phoneInputGroup) phoneInputGroup.style.display = 'flex';
            if (phoneInput)      phoneInput.value = existingData.phone || '';
            if (phoneInput)      phoneInput.focus();
        });
    }

    if (savePhoneBtn) {
        savePhoneBtn.addEventListener('click', () => {
            const val = phoneInput ? phoneInput.value.trim() : '';
            if (!val) {
                alert('Please enter a phone number.');
                return;
            }
            existingData.phone = val;
            saveData(existingData);

            if (phoneInputGroup) phoneInputGroup.style.display = 'none';
            if (phoneDisplay)    { phoneDisplay.style.display = 'block'; phoneDisplay.textContent = val; }
            if (editPhoneBtn)    editPhoneBtn.style.display = 'block';
            if (addPhoneBtn)     addPhoneBtn.style.display  = 'none';

            showToast('✅ Phone number saved!');
        });
    }

    /* ════════════════════════════════════════════
       NIN
    ════════════════════════════════════════════ */
    const addNinBtn    = document.getElementById('addNinBtn');
    const ninInputGroup = document.getElementById('ninInputGroup');
    const ninInput      = document.getElementById('ninInput');
    const saveNinBtn    = document.getElementById('saveNinBtn');
    const ninDisplay    = document.getElementById('ninDisplay');

    if (existingData.nin) {
        if (addNinBtn)   addNinBtn.style.display   = 'none';
        if (ninDisplay)  { ninDisplay.style.display = 'block'; ninDisplay.textContent = existingData.nin; }
    }

    if (addNinBtn) {
        addNinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNinBtn.style.display = 'none';
            if (ninInputGroup) ninInputGroup.style.display = 'flex';
            if (ninInput) ninInput.focus();
        });
    }

    if (saveNinBtn) {
        saveNinBtn.addEventListener('click', () => {
            const val = ninInput ? ninInput.value.trim() : '';
            if (!val || val.length !== 11) {
                alert('NIN must be exactly 11 digits.');
                return;
            }
            existingData.nin = val;
            saveData(existingData);

            if (ninInputGroup) ninInputGroup.style.display = 'none';
            if (ninDisplay)    { ninDisplay.style.display = 'block'; ninDisplay.textContent = val; }

            showToast('✅ NIN saved successfully!');
        });
    }

    /* ════════════════════════════════════════════
       BVN
    ════════════════════════════════════════════ */
    const addBvnBtn     = document.getElementById('addBvnBtn');
    const bvnInputGroup = document.getElementById('bvnInputGroup');
    const bvnInput      = document.getElementById('bvnInput');
    const saveBvnBtn    = document.getElementById('saveBvnBtn');
    const bvnDisplay    = document.getElementById('bvnDisplay');

    if (existingData.bvn) {
        if (addBvnBtn)  addBvnBtn.style.display  = 'none';
        if (bvnDisplay) { bvnDisplay.style.display = 'block'; bvnDisplay.textContent = '***' + existingData.bvn.slice(-4); }
    }

    if (addBvnBtn) {
        addBvnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addBvnBtn.style.display = 'none';
            if (bvnInputGroup) bvnInputGroup.style.display = 'flex';
            if (bvnInput) bvnInput.focus();
        });
    }

    if (saveBvnBtn) {
        saveBvnBtn.addEventListener('click', () => {
            const val = bvnInput ? bvnInput.value.trim() : '';
            if (!val || val.length !== 11) {
                alert('BVN must be exactly 11 digits.');
                return;
            }
            existingData.bvn = val;
            saveData(existingData);

            if (bvnInputGroup) bvnInputGroup.style.display = 'none';
            if (bvnDisplay)    { bvnDisplay.style.display = 'block'; bvnDisplay.textContent = '***' + val.slice(-4); }

            showToast('✅ BVN saved securely!');
        });
    }

    /* ════════════════════════════════════════════
       2FA TOGGLE
    ════════════════════════════════════════════ */
    const tfaToggle = document.getElementById('tfaToggle');
    if (tfaToggle) {
        const savedTfa = localStorage.getItem('accountTfa');
        if (savedTfa !== null) tfaToggle.checked = savedTfa === 'true';
        tfaToggle.addEventListener('change', (e) => {
            localStorage.setItem('accountTfa', e.target.checked);
        });
    }

    /* ════════════════════════════════════════════
       DISABLE / CLOSE ACCOUNT
    ════════════════════════════════════════════ */
    const disableAccountBtn = document.getElementById('disableAccountBtn');
    if (disableAccountBtn) {
        disableAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            securityConfirm(
                '⏸ Temporarily Disable Account',
                'Your account will be locked for 5 minutes. You can log back in after that time.',
                'Disable Account',
                true,
                () => {
                    if (existingData.email) {
                        localStorage.setItem('disabledAccountEmail', existingData.email);
                        localStorage.setItem('disabledAccountTime', Date.now().toString());
                    }
                    localStorage.removeItem('loggedInUser');
                    showToast('⏸ Account temporarily disabled.');
                    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
                }
            );
        });
    }

    const closeAccountBtn = document.getElementById('closeAccountBtn');
    if (closeAccountBtn) {
        closeAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            securityConfirm(
                '🗑 Close Account Permanently',
                'This will permanently delete all your data and cannot be undone. Are you absolutely sure?',
                'Yes, Close Account',
                true,
                () => {
                    localStorage.clear();
                    showToast('Account closed. Redirecting…');
                    setTimeout(() => { window.location.href = 'createaccount.html'; }, 1500);
                }
            );
        });
    }

    /* ════════════════════════════════════════════
       CHANGE PASSWORD MODAL
    ════════════════════════════════════════════ */
    const passwordChangeModal     = document.getElementById('passwordChangeModal');
    const passwordModalClose      = document.getElementById('passwordModalClose');
    const passwordModalCancel     = document.getElementById('passwordModalCancel');
    const savePasswordChangeBtn   = document.getElementById('savePasswordChangeBtn');
    const oldPasswordInput        = document.getElementById('oldPassword');
    const newPasswordInput        = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const errorDiv                = document.getElementById('passwordChangeError');

    const openPasswordModal = () => {
        if (!passwordChangeModal) return;
        passwordChangeModal.hidden = false;
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        oldPasswordInput.focus();
    };
    const closePasswordModal = () => {
        if (passwordChangeModal) passwordChangeModal.hidden = true;
    };

    if (changePasswordBtn) changePasswordBtn.addEventListener('click', openPasswordModal);
    if (passwordModalClose)  passwordModalClose.addEventListener('click', closePasswordModal);
    if (passwordModalCancel) passwordModalCancel.addEventListener('click', closePasswordModal);
    if (passwordChangeModal) {
        passwordChangeModal.addEventListener('click', (e) => {
            if (e.target === passwordChangeModal) closePasswordModal();
        });
    }

    if (savePasswordChangeBtn) {
        savePasswordChangeBtn.addEventListener('click', async () => {
            const oldPassword        = oldPasswordInput.value;
            const newPassword        = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (!oldPassword || !newPassword || !confirmNewPassword) {
                errorDiv.textContent = 'All fields are required.';
                errorDiv.style.display = 'block';
                return;
            }
            if (newPassword.length < 6) {
                errorDiv.textContent = 'New password must be at least 6 characters.';
                errorDiv.style.display = 'block';
                return;
            }
            if (newPassword !== confirmNewPassword) {
                errorDiv.textContent = 'New passwords do not match.';
                errorDiv.style.display = 'block';
                return;
            }

            // Verify old password against stored value first (fast local check)
            const storedUser = getUserData();
            if (storedUser.password && storedUser.password !== oldPassword) {
                errorDiv.textContent = 'Current password is incorrect.';
                errorDiv.style.display = 'block';
                return;
            }

            errorDiv.style.display = 'none';
            const origText = savePasswordChangeBtn.textContent;
            savePasswordChangeBtn.textContent = 'Saving…';
            savePasswordChangeBtn.disabled = true;

            try {
                const userEmail = storedUser.email;

                // Always re-authenticate with Firebase using email + old password,
                // then update — this is required for the new password to work at next login.
                const { signInWithEmailAndPassword: fbSignIn } = await import(
                    "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js"
                );
                const freshCred = await fbSignIn(auth, userEmail, oldPassword);
                await updatePassword(freshCred.user, newPassword);

                // Also update localStorage so the stored password stays in sync
                storedUser.password = newPassword;
                saveData(storedUser);

                showToast('✅ Password updated! Use your new password next time you log in.');
                closePasswordModal();
            } catch (error) {
                console.error('Password update error:', error);
                const isWrongPwd = error.code === 'auth/wrong-password'
                    || error.code === 'auth/invalid-credential';
                errorDiv.textContent = isWrongPwd
                    ? 'Current password is incorrect.'
                    : 'Failed to update password. Please try again.';
                errorDiv.style.display = 'block';
            } finally {
                savePasswordChangeBtn.textContent = origText;
                savePasswordChangeBtn.disabled = false;
            }
        });
    }

    /* ════════════════════════════════════════════
       CHANGE PIN MODAL
    ════════════════════════════════════════════ */
    const pinChangeModal  = document.getElementById('pinChangeModal');
    const changePinBtn    = document.getElementById('changePinBtn');
    const pinModalClose   = document.getElementById('pinModalClose');
    const pinModalCancel  = document.getElementById('pinModalCancel');
    const savePinChangeBtn = document.getElementById('savePinChangeBtn');
    const pinErrorDiv     = document.getElementById('pinChangeError');

    const oldPinInputs     = document.querySelectorAll('#oldPinRow .pin-dot-input');
    const newPinInputs     = document.querySelectorAll('#newPinRow .pin-dot-input');
    const confirmPinInputs = document.querySelectorAll('#confirmPinRow .pin-dot-input');

    function getPinValue(inputs) {
        return Array.from(inputs).map(i => i.value).join('');
    }

    function clearPinRow(inputs) {
        inputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
    }

    function setupPinDotInputs(inputs, nextRowInputs) {
        inputs.forEach((input, idx) => {
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                if (!/^[0-9]$/.test(val)) { e.target.value = ''; e.target.classList.remove('filled'); return; }
                e.target.classList.add('filled');
                if (idx < inputs.length - 1) { inputs[idx + 1].focus(); }
                else if (nextRowInputs) { nextRowInputs[0].focus(); }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (e.target.value === '') { if (idx > 0) { inputs[idx-1].value = ''; inputs[idx-1].classList.remove('filled'); inputs[idx-1].focus(); } }
                    else { e.target.value = ''; e.target.classList.remove('filled'); }
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft'  && idx > 0)               { inputs[idx-1].focus(); }
                  else if (e.key === 'ArrowRight' && idx < inputs.length-1) { inputs[idx+1].focus(); }
            });
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const digits = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, inputs.length);
                digits.split('').forEach((d, i) => { if (inputs[i]) { inputs[i].value = d; inputs[i].classList.add('filled'); } });
                const lastIdx = Math.min(digits.length - 1, inputs.length - 1);
                if (inputs[lastIdx]) inputs[lastIdx].focus();
            });
        });
    }

    setupPinDotInputs(oldPinInputs, newPinInputs);
    setupPinDotInputs(newPinInputs, confirmPinInputs);
    setupPinDotInputs(confirmPinInputs, null);

    const openPinModal = () => {
        if (!pinChangeModal) return;
        clearPinRow(oldPinInputs);
        clearPinRow(newPinInputs);
        clearPinRow(confirmPinInputs);
        pinErrorDiv.style.display = 'none';
        pinErrorDiv.textContent = '';
        pinChangeModal.hidden = false;
        if (oldPinInputs[0]) oldPinInputs[0].focus();
    };
    const closePinModal = () => { if (pinChangeModal) pinChangeModal.hidden = true; };

    if (changePinBtn)   changePinBtn.addEventListener('click', openPinModal);
    if (pinModalClose)  pinModalClose.addEventListener('click', closePinModal);
    if (pinModalCancel) pinModalCancel.addEventListener('click', closePinModal);
    if (pinChangeModal) {
        pinChangeModal.addEventListener('click', (e) => { if (e.target === pinChangeModal) closePinModal(); });
    }

    if (savePinChangeBtn) {
        savePinChangeBtn.addEventListener('click', () => {
            const oldPin     = getPinValue(oldPinInputs);
            const newPin     = getPinValue(newPinInputs);
            const confirmPin = getPinValue(confirmPinInputs);

            if (oldPin.length < 4 || newPin.length < 4 || confirmPin.length < 4) {
                pinErrorDiv.textContent = 'Please fill in all PIN fields (4 digits each).';
                pinErrorDiv.style.display = 'block';
                return;
            }

            const storedUser = getUserData();
            if (!storedUser.pin || storedUser.pin !== oldPin) {
                pinErrorDiv.textContent = 'Current PIN is incorrect.';
                pinErrorDiv.style.display = 'block';
                clearPinRow(oldPinInputs);
                if (oldPinInputs[0]) oldPinInputs[0].focus();
                return;
            }

            if (newPin !== confirmPin) {
                pinErrorDiv.textContent = 'New PINs do not match.';
                pinErrorDiv.style.display = 'block';
                clearPinRow(newPinInputs);
                clearPinRow(confirmPinInputs);
                if (newPinInputs[0]) newPinInputs[0].focus();
                return;
            }

            pinErrorDiv.style.display = 'none';
            const origText = savePinChangeBtn.textContent;
            savePinChangeBtn.textContent = 'Saving…';
            savePinChangeBtn.disabled = true;

            setTimeout(() => {
                storedUser.pin = newPin;
                saveData(storedUser);

                showToast('🔒 PIN updated successfully!');
                closePinModal();
                savePinChangeBtn.textContent = origText;
                savePinChangeBtn.disabled = false;
            }, 800);
        });
    }

}; // end initSecurity

/* ── Toast helper (uses Toastify if loaded, else alert) ── */
function showToast(msg) {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: msg,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: { background: 'linear-gradient(to right, #00d18b, #00b09b)', borderRadius: '8px' }
        }).showToast();
    }
}

/* ── Run as soon as DOM is ready ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurity);
} else {
    initSecurity();
}
