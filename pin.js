        document.addEventListener('DOMContentLoaded', () => {
            const createInputs = document.querySelectorAll('.create-pin-field');
            const confirmInputs = document.querySelectorAll('.confirm-pin-field');
            const submitBtn = document.getElementById('createPinBtn');

            if (createInputs.length > 0) {
                createInputs[0].focus();
            }

            setupPinAutofocus(createInputs, confirmInputs);
            setupPinAutofocus(confirmInputs, null);

            function setupPinAutofocus(inputs, nextSectionInputs) {
                inputs.forEach((input, index) => {
                    input.addEventListener('input', (e) => {
                        const val = e.target.value;
                        if (!/^[0-9]$/.test(val)) {
                            e.target.value = '';
                            checkInputsFilled();
                            return;
                        }
                        if (index < inputs.length - 1) {
                            inputs[index + 1].focus();
                        } else if (index === inputs.length - 1 && nextSectionInputs) {
                            nextSectionInputs[0].focus();
                        }
                        checkInputsFilled();
                    });

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace') {
                            if (e.target.value === '') {
                                if (index > 0) {
                                    inputs[index - 1].focus();
                                    inputs[index - 1].value = '';
                                } else if (index === 0 && !nextSectionInputs) {
                                    const prevSectionInputs = document.querySelectorAll('.create-pin-field');
                                    prevSectionInputs[prevSectionInputs.length - 1].focus();
                                    prevSectionInputs[prevSectionInputs.length - 1].value = '';
                                }
                            } else {
                                e.target.value = '';
                            }
                            checkInputsFilled();
                        } else if (e.key === 'ArrowLeft') {
                            if (index > 0) {
                                inputs[index - 1].focus();
                            }
                        } else if (e.key === 'ArrowRight') {
                            if (index < inputs.length - 1) {
                                inputs[index + 1].focus();
                            }
                        }
                    });
                    input.addEventListener('paste', (e) => {
                        e.preventDefault();
                        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').trim();
                        if (pasteData.length > 0) {
                            let chars = pasteData.split('');
                            inputs.forEach((inp, idx) => {
                                if (chars[idx]) {
                                    inp.value = chars[idx];
                                }
                            });
                            const lastFilledIdx = Math.min(chars.length - 1, inputs.length - 1);
                            inputs[lastFilledIdx].focus();
                            checkInputsFilled();
                        }
                    });
                });
            }

            function checkInputsFilled() {
                const createPin = getPinValue(createInputs);
                const confirmPin = getPinValue(confirmInputs);

                if (createPin.length === 4 && confirmPin.length === 4) {
                    submitBtn.disabled = false;
                    submitBtn.classList.add('active');
                } else {
                    submitBtn.disabled = true;
                    submitBtn.classList.remove('active');
                }
            }

            function getPinValue(inputs) {
                let pin = '';
                inputs.forEach(input => {
                    pin += input.value;
                });
                return pin;
            }
            window.handlePinSubmit = function (event) {
                event.preventDefault();
                const createPin = getPinValue(createInputs);
                const confirmPin = getPinValue(confirmInputs);

                if (createPin.length !== 4 || confirmPin.length !== 4) {
                    customAlert("Please enter a 4-digit PIN in both sections.");
                    return;
                }

                if (createPin !== confirmPin) {
                    customAlert("The PINs do not match. Please try again.");
                    confirmInputs.forEach(input => input.value = '');
                    confirmInputs[0].focus();
                    checkInputsFilled();
                } else {
                    let userData = {};
                    try {
                        const storedData = localStorage.getItem('userData');
                        if (storedData) {
                            userData = JSON.parse(storedData);
                        }
                    } catch (err) {
                        console.error('Error parsing userData from localStorage:', err);
                    }

                    userData.pin = createPin;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    customAlert("PIN created successfully!", "login.html");
                }
            };
        });