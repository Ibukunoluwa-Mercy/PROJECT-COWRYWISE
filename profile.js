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
            if (existingData.displayName) {
                document.querySelector('.user-full-name').textContent = existingData.displayName;
            } else if (existingData.email) {
                document.querySelector('.user-full-name').textContent = existingData.email.split('@')[0];
            }
            
            const usernameInput = document.getElementById('usernameInput');
            if (existingData.email && usernameInput) {

                const derivedUsername = '@' + existingData.email.split('@')[0].toLowerCase();
                usernameInput.value = existingData.username || derivedUsername;
            }


            const saveBtn = document.querySelector('.btn-save');
            if (saveBtn && usernameInput) {
                saveBtn.addEventListener('click', () => {
                    existingData.username = usernameInput.value;
                    localStorage.setItem('userData', JSON.stringify(existingData));
                    saveBtn.textContent = 'Saved!';
                    setTimeout(() => saveBtn.textContent = 'Save Changes', 2000);
                });
            }


            const nokDisplay = document.getElementById('nokDisplay');
            const nokInputGroup = document.getElementById('nokInputGroup');
            const nokInput = document.getElementById('nokInput');
            const nokBtn = document.getElementById('nokBtn');

            if (existingData.nextOfKin) {
                nokDisplay.textContent = existingData.nextOfKin;
                nokDisplay.classList.remove('text-muted');
                nokBtn.textContent = 'Edit';
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
                            localStorage.setItem('userData', JSON.stringify(existingData));
                            nokDisplay.textContent = newVal;
                            nokDisplay.classList.remove('text-muted');
                            nokBtn.textContent = 'Edit';
                        } else {
                            existingData.nextOfKin = '';
                            localStorage.setItem('userData', JSON.stringify(existingData));
                            nokDisplay.textContent = 'No Next Of Kin';
                            nokDisplay.classList.add('text-muted');
                            nokBtn.textContent = 'Add Next Of Kin';
                        }
                        nokDisplay.style.display = 'block';
                        nokInputGroup.style.display = 'none';
                    }
                });
            }


            const visibilityToggle = document.getElementById('visibilityToggle');
            const savedVisibility = localStorage.getItem('accountVisibility');
            if (savedVisibility !== null) {
                visibilityToggle.checked = savedVisibility === 'true';
            }
            if (visibilityToggle) {
                visibilityToggle.addEventListener('change', (e) => {
                    localStorage.setItem('accountVisibility', e.target.checked);
                });
            }






            const themeSystem = document.getElementById('themeSystem');
            const themeDay = document.getElementById('themeDay');
            const themeNight = document.getElementById('themeNight');
            const body = document.body;

            const savedTheme = localStorage.getItem('appTheme') || 'system';

            function updateThemeUI(theme) {
                [themeSystem, themeDay, themeNight].forEach(el => el.classList.remove('active'));
                if (theme === 'system') themeSystem.classList.add('active');
                if (theme === 'day') themeDay.classList.add('active');
                if (theme === 'night') themeNight.classList.add('active');
                
                body.classList.remove('dark-theme');
                if (theme === 'night') {
                    body.classList.add('dark-theme');
                } else if (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    body.classList.add('dark-theme');
                }
            }

            updateThemeUI(savedTheme);

            themeSystem.addEventListener('click', () => {
                localStorage.setItem('appTheme', 'system');
                updateThemeUI('system');
            });

            themeDay.addEventListener('click', () => {
                localStorage.setItem('appTheme', 'day');
                updateThemeUI('day');
            });

            themeNight.addEventListener('click', () => {
                localStorage.setItem('appTheme', 'night');
                updateThemeUI('night');
            });


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
        });