        document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('loggedInUser')) {
                window.location.href = 'login.html';
                return;
            }
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const firstName = userData.firstName || "Adeola";
            document.getElementById('sidebarGreeting').textContent = `Hey ${firstName}`;

            const userProfileBtn = document.getElementById('userProfileBtn');
            const logoutDropdown = document.getElementById('logoutDropdown');
            const logoutItem = document.getElementById('logoutItem');

            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = logoutDropdown.style.display === 'block';
                logoutDropdown.style.display = isShown ? 'none' : 'block';
            });

            logoutItem.addEventListener('click', (e) => {
                e.stopPropagation();
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });

            document.addEventListener('click', () => {
                logoutDropdown.style.display = 'none';
            });

            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.querySelector('.sidebar');
            if (menuToggle && sidebar) {
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sidebar.classList.toggle('active');
                });
            }
        });