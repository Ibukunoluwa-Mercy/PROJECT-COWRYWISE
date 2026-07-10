const WALLET_BALANCE_PREFIX = 'walletBalance::';

function getWalletBalanceKey() {
    const userId = localStorage.getItem('loggedInUser');
    return userId ? `${WALLET_BALANCE_PREFIX}${userId}` : `${WALLET_BALANCE_PREFIX}guest`;
}

function getWalletBalance() {
    const value = localStorage.getItem(getWalletBalanceKey());
    return value ? Number(value) : 0;
}

function setWalletBalance(amount) {
    localStorage.setItem(getWalletBalanceKey(), String(amount));
}

function initializeWalletBalance() {
    const key = getWalletBalanceKey();
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, '0');
    }
}

function formatNaira(amount) {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateBalanceDisplay() {
    const amountEl = document.querySelector('.balance-card .amount');
    if (!amountEl) return;
    const value = getWalletBalance();
    amountEl.innerHTML = `<span>₦</span> ${formatNaira(value)}<span class="decimal"></span>`;
}

document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('loggedInUser')) {
                window.location.href = 'login.html';
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const firstName = userData.firstName || "Adeola";
            const greetingEl = document.getElementById('sidebarGreeting');
            if (greetingEl) {
                greetingEl.textContent = `Hey ${firstName}`;
            }
            initializeWalletBalance();
            updateBalanceDisplay();

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
                // Create dim overlay for clicking outside to close
                const sidebarOverlay = document.createElement('div');
                sidebarOverlay.id = 'sidebarOverlay';
                sidebarOverlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:1000;transition:opacity 0.3s;';
                document.body.appendChild(sidebarOverlay);

                const openSidebar = () => {
                    sidebar.classList.add('active');
                    sidebarOverlay.style.display = 'block';
                };
                const closeSidebar = () => {
                    sidebar.classList.remove('active');
                    sidebarOverlay.style.display = 'none';
                };

                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
                });

                sidebarOverlay.addEventListener('click', closeSidebar);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeSidebar();
                });
            }

            const cashButtons = document.querySelectorAll('.cash-buttons button:not(.add-btn)');
            const addCashButton = document.querySelector('.cash-buttons .add-btn');
            const paystackAmountInput = document.getElementById('paystackAmount');
            const paystackPayBtn = document.getElementById('paystackPayBtn');
            const paymentModalOverlay = document.getElementById('paymentModalOverlay');
            const paymentModalClose = document.getElementById('paymentModalClose');
            const paymentModalCancel = document.getElementById('paymentModalCancel');

            const clearAmountSelection = () => {
                cashButtons.forEach((button) => button.classList.remove('selected'));
            };

            const selectAmountButton = (button) => {
                clearAmountSelection();
                button.classList.add('selected');
                // Use data-amount if set, otherwise parse text (handles "20K" → 20000)
                let rawValue;
                if (button.dataset.amount) {
                    rawValue = button.dataset.amount;
                } else {
                    const text = button.textContent.trim();
                    const hasK = /k/i.test(text);
                    const digits = text.replace(/[^0-9.]/gi, '');
                    rawValue = digits ? (hasK ? String(parseFloat(digits) * 1000) : digits) : '';
                }
                if (paystackAmountInput && rawValue) {
                    paystackAmountInput.value = rawValue;
                }
            };

            cashButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    selectAmountButton(button);
                    openPaymentModal();
                });
            });

            const closePaymentModal = () => {
                if (paymentModalOverlay) {
                    paymentModalOverlay.hidden = true;
                }
            };

            const openPaymentModal = () => {
                if (paymentModalOverlay) {
                    paymentModalOverlay.hidden = false;
                }
                if (paystackAmountInput) {
                    paystackAmountInput.focus();
                }
            };

            if (addCashButton) {
                addCashButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPaymentModal();
                });
            }

            if (paymentModalClose) {
                paymentModalClose.addEventListener('click', closePaymentModal);
            }

            if (paymentModalCancel) {
                paymentModalCancel.addEventListener('click', closePaymentModal);
            }

            if (paymentModalOverlay) {
                paymentModalOverlay.addEventListener('click', (e) => {
                    if (e.target === paymentModalOverlay) {
                        closePaymentModal();
                    }
                });
            }

            if (paystackPayBtn && paystackAmountInput) {
                paystackPayBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    startPaystackPayment();
                });
            }
        });

            const eyeIcon = document.querySelector('.balance-card .card-label .fa-eye, .balance-card .card-label .fa-eye-slash');
            const amountEl = document.querySelector('.balance-card .amount');
            if (eyeIcon && amountEl) {
                eyeIcon.style.cursor = 'pointer';
                let hidden = false;

                const showBalance = () => {
                    amountEl.innerHTML = `<span>₦</span> ${formatNaira(getWalletBalance())}<span class="decimal"></span>`;
                    eyeIcon.classList.remove('fa-eye-slash');
                    eyeIcon.classList.add('fa-eye');
                };

                const hideBalance = () => {
                    amountEl.innerHTML = '<span>₦</span> <span class="masked">•••••</span>';
                    eyeIcon.classList.remove('fa-eye');
                    eyeIcon.classList.add('fa-eye-slash');
                };

                eyeIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hidden = !hidden;
                    if (hidden) {
                        hideBalance();
                    } else {
                        showBalance();
                    }
                });
            }

            function startPaystackPayment() {
                const paystackAmountInput = document.getElementById('paystackAmount');
                const amountValue = paystackAmountInput ? Number(paystackAmountInput.value.replace(/[^0-9]/g, '')) : 0;
                if (!amountValue || amountValue < 100) {
                    customAlert('Enter a valid amount of at least ₦100.');
                    return;
                }

                if (!window.PaystackPop) {
                    customAlert('Paystack SDK is not loaded. Refresh the page and try again.');
                    return;
                }

                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                const email = userData.email || 'customer@example.com';
                const firstName = userData.firstName || '';
                const lastName = userData.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'Customer';

                const handler = PaystackPop.setup({
                    key: 'pk_test_f9099f0dab62a34161b2bbdcb1a5796358d7079f',
                    email,
                    amount: amountValue * 100,
                    currency: 'NGN',
                    ref: `COWRYWISE-${Math.floor(Math.random() * 1000000000)}`,
                    metadata: {
                        custom_fields: [
                            {
                                display_name: 'Full Name',
                                variable_name: 'full_name',
                                value: fullName,
                            },
                        ],
                    },
                    callback(response) {
                        const currentBalance = getWalletBalance();
                        const newBalance = currentBalance + amountValue;
                        setWalletBalance(newBalance);
                        updateBalanceDisplay();
                        const overlay = document.getElementById('paymentModalOverlay');
                        if (overlay) overlay.hidden = true;
                        if (paystackAmountInput) paystackAmountInput.value = '';
                        Toastify({
                            text: `✅ Payment successful! Ref: ${response.reference}`,
                            duration: 5000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: "linear-gradient(to right, #00d18b, #00b09b)",
                                borderRadius: "12px",
                                fontFamily: "'Onest', sans-serif",
                                fontSize: "14px",
                                padding: "14px 20px",
                                boxShadow: "0 8px 24px rgba(0, 209, 139, 0.3)",
                            },
                            onClick: function(){}
                        }).showToast();
                    },
                    onClose() {
                        Toastify({
                            text: "⚠️ Payment was cancelled before completion.",
                            duration: 4000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: "linear-gradient(to right, #f7971e, #ffd200)",
                                borderRadius: "12px",
                                fontFamily: "'Onest', sans-serif",
                                fontSize: "14px",
                                padding: "14px 20px",
                                color: "#1a1a2e",
                                boxShadow: "0 8px 24px rgba(247, 151, 30, 0.3)",
                            },
                            onClick: function(){}
                        }).showToast();
                    },
                });

                handler.openIframe();
            }