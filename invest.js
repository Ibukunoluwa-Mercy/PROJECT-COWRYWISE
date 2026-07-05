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
    const amountEl = document.querySelector('.invest-header .balance-section .amount');
    if (!amountEl) return;
    amountEl.innerHTML = `<span>₦</span> ${formatNaira(getWalletBalance())}`;
}

document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('loggedInUser')) {
                window.location.href = 'login.html';
                return;
            }
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const firstName = userData.firstName || "Adeola";
            document.getElementById('sidebarGreeting').textContent = `Hey ${firstName}`;
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

            // Menu Toggle for mobile sidebar
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.querySelector('.sidebar');
            if (menuToggle && sidebar) {
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sidebar.classList.toggle('active');
                });
            }

            const cashButtons = document.querySelectorAll('.cash-buttons button:not(.add-btn)');
            const addCashButton = document.querySelector('.cash-buttons .add-btn');
            const paystackAmountInput = document.getElementById('paystackAmount');
            const paystackPayBtn = document.getElementById('paystackPayBtn');
            const paymentModalOverlay = document.getElementById('paymentModalOverlay');
            const paymentModalClose = document.getElementById('paymentModalClose');
            const paymentModalCancel = document.getElementById('paymentModalCancel');

            const parseAmount = (text) => {
                if (!text) return 0;
                let normalized = text.replace(/,/g, '').replace(/₦|\$|NGN|USD/gi, '').trim().toUpperCase();
                let multiplier = 1;
                if (normalized.endsWith('K')) {
                    multiplier = 1000;
                    normalized = normalized.slice(0, -1).trim();
                }
                if (normalized.endsWith('M')) {
                    multiplier = 1000000;
                    normalized = normalized.slice(0, -1).trim();
                }
                const numericValue = Number(normalized);
                return Number.isFinite(numericValue) ? numericValue * multiplier : 0;
            };

            const closePaymentModal = () => {
                if (paymentModalOverlay) {
                    paymentModalOverlay.hidden = true;
                }
                if (paystackAmountInput) {
                    paystackAmountInput.value = '';
                }
                clearAmountSelection();
            };

            const openPaymentModal = (amount = '') => {
                if (paymentModalOverlay) {
                    paymentModalOverlay.hidden = false;
                }
                if (paystackAmountInput) {
                    paystackAmountInput.value = amount;
                    paystackAmountInput.focus();
                }
            };

            const clearAmountSelection = () => {
                cashButtons.forEach((button) => button.classList.remove('selected'));
            };

            const selectAmountButton = (button) => {
                clearAmountSelection();
                button.classList.add('selected');
                const amount = parseAmount(button.textContent);
                if (paystackAmountInput) {
                    paystackAmountInput.value = amount || '';
                }
            };

            cashButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectAmountButton(button);
                    const amount = parseAmount(button.textContent);
                    openPaymentModal(amount || '');
                });
            });

            if (addCashButton) {
                addCashButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPaymentModal('');
                });
            }

            if (paymentModalClose) {
                paymentModalClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    closePaymentModal();
                });
            }

            if (paymentModalCancel) {
                paymentModalCancel.addEventListener('click', (e) => {
                    e.preventDefault();
                    closePaymentModal();
                });
            }

            if (paymentModalOverlay) {
                paymentModalOverlay.addEventListener('click', (e) => {
                    if (e.target === paymentModalOverlay) {
                        closePaymentModal();
                    }
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closePaymentModal();
                }
            });

            if (paystackPayBtn && paystackAmountInput) {
                paystackPayBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    startPaystackPayment();
                });
            }

            function startPaystackPayment() {
                const paystackAmountInput = document.getElementById('paystackAmount');
                const amountValue = paystackAmountInput ? Number(paystackAmountInput.value.replace(/[^0-9]/g, '')) : 0;
                if (!amountValue || amountValue < 100) {
                    alert('Enter a valid amount of at least ₦100.');
                    return;
                }

                if (!window.PaystackPop) {
                    alert('Paystack SDK is not loaded. Please refresh and try again.');
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
                        clearAmountSelection();
                        closePaymentModal();
                        alert(`Payment successful! Reference: ${response.reference}`);
                    },
                    onClose() {
                        alert('Payment window was closed before completion.');
                    },
                });

                handler.openIframe();
            }

            // Eye icon: toggle show/hide of the invest balance amount
            const eyeIcon = document.querySelector('.invest-header .balance-section .fa-eye, .invest-header .balance-section .fa-eye-slash');
            const amountEl = document.querySelector('.invest-header .balance-section .amount');
            if (eyeIcon && amountEl) {
                eyeIcon.style.cursor = 'pointer';
                const originalHTML = amountEl.innerHTML;
                let hidden = false;

                eyeIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hidden = !hidden;
                    if (hidden) {
                        amountEl.innerHTML = '<span>₦</span> <span class="masked">•••••</span>';
                        eyeIcon.classList.remove('fa-eye');
                        eyeIcon.classList.add('fa-eye-slash');
                    } else {
                        amountEl.innerHTML = originalHTML;
                        eyeIcon.classList.remove('fa-eye-slash');
                        eyeIcon.classList.add('fa-eye');
                    }
                });
            }
        });
        