document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'login.html';
        return;
    }

    // Theme Application
    // Initial theme is set by theme-loader.js in <head> to prevent FOUC.
    // This listener handles live updates if the OS theme changes while the user is on the page.
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const savedTheme = localStorage.getItem('appTheme') || 'system';
            if (savedTheme === 'system') {
                // If system theme is active, toggle dark-theme class based on OS preference
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark-theme', isDark);
            }
        });
    }

    // Common UI elements
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
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
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }
});