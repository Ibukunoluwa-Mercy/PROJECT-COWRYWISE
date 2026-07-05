document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const firstName = userData.firstName || "Adeola";
    const sidebarGreeting = document.getElementById('sidebarGreeting');
    if (sidebarGreeting) {
        sidebarGreeting.textContent = `Hey ${firstName}`;
    }

    const userProfileBtn = document.getElementById('userProfileBtn');
    const logoutDropdown = document.getElementById('logoutDropdown');
    const logoutItem = document.getElementById('logoutItem');

    if (userProfileBtn && logoutDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = logoutDropdown.style.display === 'block';
            logoutDropdown.style.display = isShown ? 'none' : 'block';
        });
    }

    if (logoutItem) {
        logoutItem.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }

    document.addEventListener('click', () => {
        if (logoutDropdown) {
            logoutDropdown.style.display = 'none';
        }
    });

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    const nestModalOverlay = document.getElementById('nestModalOverlay');
    const btnStartJourney = document.getElementById('btnStartJourney');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (nestModalOverlay) {
        nestModalOverlay.style.display = 'flex';
    }

    function closeOnboardingModal() {
        if (nestModalOverlay) {
            nestModalOverlay.style.opacity = '0';
            setTimeout(() => {
                nestModalOverlay.style.display = 'none';
            }, 300);
        }
    }

    if (btnStartJourney) {
        btnStartJourney.addEventListener('click', closeOnboardingModal);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeOnboardingModal);
    }

    const nestSetupForm = document.getElementById('nestSetupForm');
    if (nestSetupForm) {
        nestSetupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const childName = document.getElementById('childFirstName').value;
            alert(`Congratulations! ${childName}'s Nest is being created successfully.`);
            window.location.href = 'dashboard.html';
        });
    }
});
