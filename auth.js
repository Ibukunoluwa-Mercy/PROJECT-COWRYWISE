const KEYS = {
    LOGGED_IN_USER: 'loggedInUser',
    USER_DATA: 'userData',
    USER_PROFILE_PREFIX: 'userProfile_',
    WALLET_BALANCE_PREFIX: 'walletBalance::',
    APP_THEME: 'appTheme',
};

export function isLoggedIn() {
    return !!localStorage.getItem(KEYS.LOGGED_IN_USER);
}

export function getLoggedInUserId() {
    return localStorage.getItem(KEYS.LOGGED_IN_USER);
}

export function setLoggedInUser(uid) {
    localStorage.setItem(KEYS.LOGGED_IN_USER, uid);
}

export function getUserData() {
    const data = localStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : {};
}

export function setUserData(data) {
    localStorage.setItem(KEYS.USER_DATA, JSON.stringify(data));
}

export function getUserProfile(email) {
    if (!email) return {};
    const data = localStorage.getItem(`${KEYS.USER_PROFILE_PREFIX}${email}`);
    return data ? JSON.parse(data) : {};
}

export function setUserProfile(email, data) {
    if (!email) return;
    localStorage.setItem(`${KEYS.USER_PROFILE_PREFIX}${email}`, JSON.stringify(data));
}

export function logout() {
    localStorage.removeItem(KEYS.LOGGED_IN_USER);
    window.location.href = 'login.html';
}

export function getWalletBalance() {
    const userId = getLoggedInUserId();
    const key = userId ? `${KEYS.WALLET_BALANCE_PREFIX}${userId}` : null;
    if (!key) return 0;
    const value = localStorage.getItem(key);
    return value ? Number(value) : 0;
}

export function setWalletBalance(amount) {
    const userId = getLoggedInUserId();
    const key = userId ? `${KEYS.WALLET_BALANCE_PREFIX}${userId}` : null;
    if (key) {
        localStorage.setItem(key, String(amount));
    }
}

export function getTheme() {
    return localStorage.getItem(KEYS.APP_THEME) || 'system';
}

export function setTheme(theme) {
    localStorage.setItem(KEYS.APP_THEME, theme);
}