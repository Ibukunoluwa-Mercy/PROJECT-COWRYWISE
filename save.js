document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'login.html';
        return;
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const savedTheme = localStorage.getItem('appTheme') || 'system';
            if (savedTheme === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark-theme', isDark);
            }
        });
    }

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

    function formatNaira(amount) {
        return amount.toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    const amountEl = document.querySelector('.balance-section .amount');
    const eyeIcon = document.querySelector('.balance-section .card-label .fa-eye, .balance-section .card-label .fa-eye-slash');

    if (amountEl) {
        amountEl.innerHTML = `<span>₦</span>${formatNaira(getWalletBalance())}<span class="decimal" style="opacity: 0.6;">.00</span>`;
    }

    if (eyeIcon && amountEl) {
        eyeIcon.style.cursor = 'pointer';
        let hidden = false;

        const showBalance = () => {
            amountEl.innerHTML = `<span>₦</span>${formatNaira(getWalletBalance())}<span class="decimal" style="opacity: 0.6;">.00</span>`;
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

    const cashButtons = document.querySelectorAll('.cash-buttons button:not(.add-btn)');
    const addCashButton = document.querySelector('.cash-buttons .add-btn');
    const paystackAmountInput = document.getElementById('paystackAmount');
    const paystackPayBtn = document.getElementById('paystackPayBtn');
    const paymentModalOverlay = document.getElementById('paymentModalOverlay');
    const paymentModalClose = document.getElementById('paymentModalClose');
    const paymentModalCancel = document.getElementById('paymentModalCancel');

    cashButtons.forEach(button => {
        button.addEventListener('click', () => {
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
            openPaymentModal();
        });
    });

    const closePaymentModal = () => {
        if (paymentModalOverlay) paymentModalOverlay.hidden = true;
    };

    const openPaymentModal = () => {
        if (paymentModalOverlay) paymentModalOverlay.hidden = false;
        if (paystackAmountInput) paystackAmountInput.focus();
    };

    if (addCashButton) addCashButton.addEventListener('click', openPaymentModal);
    if (paymentModalClose) paymentModalClose.addEventListener('click', closePaymentModal);
    if (paymentModalCancel) paymentModalCancel.addEventListener('click', closePaymentModal);
    if (paymentModalOverlay) {
        paymentModalOverlay.addEventListener('click', (e) => {
            if (e.target === paymentModalOverlay) closePaymentModal();
        });
    }

    function startPaystackPayment() {
        const amountValue = Number(paystackAmountInput.value.replace(/[^0-9]/g, ''));
        if (!amountValue || amountValue < 100) return alert('Enter a valid amount of at least ₦100.');
        if (!window.PaystackPop) return alert('Paystack SDK is not loaded.');

        const handler = PaystackPop.setup({
            key: 'pk_test_f9099f0dab62a34161b2bbdcb1a5796358d7079f',
            email: userData.email || 'customer@example.com',
            amount: amountValue * 100,
            currency: 'NGN',
            ref: `COWRYWISE-${Math.floor(Math.random() * 1000000000)}`,
            callback(response) {
                const newBalance = getWalletBalance() + amountValue;
                setWalletBalance(newBalance);
                if (amountEl) {
                    amountEl.innerHTML = `<span>₦</span>${formatNaira(newBalance)}<span class="decimal" style="opacity: 0.6;">.00</span>`;
                }
                closePaymentModal();
                Toastify({
                    text: `✅ Payment successful! Ref: ${response.reference}`
                }).showToast();
            },
            onClose() {
                Toastify({
                    text: "⚠️ Payment was cancelled."
                }).showToast();
            },
        });
        handler.openIframe();
    }

    if (paystackPayBtn) {
        paystackPayBtn.addEventListener('click', startPaystackPayment);
    }
});