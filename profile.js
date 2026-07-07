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

            const emailDisplay = document.getElementById('emailDisplay');
            if (emailDisplay) {
                emailDisplay.textContent = existingData.email || 'Not provided';
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

            const genderDisplay = document.getElementById('genderDisplay');
            const genderInputGroup = document.getElementById('genderInputGroup');
            const genderInput = document.getElementById('genderInput');
            const genderBtn = document.getElementById('genderBtn');

            if (existingData.gender) {
                if (genderDisplay) {
                    genderDisplay.textContent = existingData.gender;
                    genderDisplay.classList.remove('text-muted');
                }
                if (genderBtn) genderBtn.textContent = 'Edit';
            } else {
                if (genderDisplay) {
                    genderDisplay.textContent = 'Female';
                    genderDisplay.classList.remove('text-muted');
                }
                if (genderBtn) genderBtn.textContent = 'Edit';
            }

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
                            localStorage.setItem('userData', JSON.stringify(existingData));
                            genderDisplay.textContent = newVal;
                            genderDisplay.classList.remove('text-muted');
                            genderBtn.textContent = 'Edit';
                        }
                        genderDisplay.style.display = 'block';
                        genderInputGroup.style.display = 'none';
                    }
                });
            }

            const dobDisplay = document.getElementById('dobDisplay');
            const dobInputGroup = document.getElementById('dobInputGroup');
            const dobInput = document.getElementById('dobInput');
            const dobBtn = document.getElementById('dobBtn');

            if (existingData.dob) {
                if (dobDisplay) {
                    dobDisplay.textContent = existingData.dob;
                    dobDisplay.classList.remove('text-muted');
                }
                if (dobBtn) dobBtn.textContent = 'Edit';
            } else {
                if (dobDisplay) {
                    dobDisplay.textContent = 'Not provided';
                    dobDisplay.classList.add('text-muted');
                }
                if (dobBtn) dobBtn.textContent = 'Add Date of Birth';
            }

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
                            localStorage.setItem('userData', JSON.stringify(existingData));
                            dobDisplay.textContent = newVal;
                            dobDisplay.classList.remove('text-muted');
                            dobBtn.textContent = 'Edit';
                        } else {
                            existingData.dob = '';
                            localStorage.setItem('userData', JSON.stringify(existingData));
                            dobDisplay.textContent = 'Not provided';
                            dobDisplay.classList.add('text-muted');
                            dobBtn.textContent = 'Add Date of Birth';
                        }
                        dobDisplay.style.display = 'block';
                        dobInputGroup.style.display = 'none';
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