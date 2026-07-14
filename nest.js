import { isLoggedIn, getUserData, getTheme, logout, setUserData } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const savedTheme = getTheme();
            if (savedTheme === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark-theme', isDark);
            }
        });
    }

    const userData = getUserData();
    const firstName = userData.firstName || "User";

    const greetingEl = document.getElementById('sidebarGreeting');
    if (greetingEl) {
        greetingEl.textContent = `Hey ${firstName}`;
    }

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
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

    const modal = document.getElementById('nestModalOverlay');
    const closeModalBtn = document.getElementById('modalCloseBtn');
    const startJourneyBtn = document.getElementById('btnStartJourney');

    const hideModal = () => {
        if (modal) modal.style.display = 'none';
        localStorage.setItem('nestVisited', 'true');
    };

    if (modal && !localStorage.getItem('nestVisited')) {
        modal.style.display = 'flex';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (startJourneyBtn) startJourneyBtn.addEventListener('click', hideModal);

    const nestForm = document.getElementById('nestSetupForm');
    if (nestForm) {
        nestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const firstNameInput = document.getElementById('childFirstName');
            const surnameInput   = document.getElementById('childSurname');
            const dobInput       = document.getElementById('childDob');

            const childFirst   = firstNameInput ? firstNameInput.value.trim() : '';
            const childSurname = surnameInput   ? surnameInput.value.trim()   : '';
            const childDob     = dobInput       ? dobInput.value               : '';

            if (!childFirst) {
                firstNameInput && firstNameInput.focus();
                return;
            }
            if (!childSurname) {
                surnameInput && surnameInput.focus();
                return;
            }
            if (!childDob) {
                dobInput && dobInput.focus();
                return;
            }

            const userData = getUserData();
            userData.nestChild = {
                firstName: childFirst,
                surname:   childSurname,
                dob:       childDob,
                createdAt: new Date().toISOString()
            };
            setUserData(userData);

            const dobFormatted = new Date(childDob).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            const nestRight = document.querySelector('.nest-right');
            if (nestRight) {
                nestRight.innerHTML = `
                    <div class="nest-success-card">
                        <div class="nest-success-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h2 class="nest-success-title">Nest Created!</h2>
                        <p class="nest-success-sub">
                            You've set up a Nest account for<br>
                            <strong>${childFirst} ${childSurname}</strong>
                        </p>
                        <div class="nest-success-detail">
                            <span class="detail-label"><i class="fa-regular fa-calendar"></i> Date of Birth</span>
                            <span class="detail-value">${dobFormatted}</span>
                        </div>
                        <p class="nest-success-note">
                            The funds in this Nest will remain locked until ${childFirst} turns 18.
                        </p>
                        <a href="dashboard.html" class="btn-nest-home">Go to Dashboard</a>
                    </div>
                `;
            }
        });
    }
});