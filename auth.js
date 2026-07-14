/**
 * This module provides a centralized way to interact with localStorage
 * for user sessions, profiles, and settings.
 */

const KEYS = {
    LOGGED_IN_USER: 'loggedInUser',
    USER_DATA: 'userData',
    USER_PROFILE_PREFIX: 'userProfile_',
    WALLET_BALANCE_PREFIX: 'walletBalance::',
    APP_THEME: 'appTheme',
};

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if a user is logged in, false otherwise.
 */
export function isLoggedIn() {
    return !!localStorage.getItem(KEYS.LOGGED_IN_USER);
}

/**
 * Retrieves the UID of the currently logged-in user.
 * @returns {string|null} The user's UID or null if not logged in.
 */
export function getLoggedInUserId() {
    return localStorage.getItem(KEYS.LOGGED_IN_USER);
}

/**
 * Sets the UID of the currently logged-in user.
 * @param {string} uid The user's UID.
 */
export function setLoggedInUser(uid) {
    localStorage.setItem(KEYS.LOGGED_IN_USER, uid);
}

/**
 * Retrieves the general user data for the current session.
 * @returns {object} The user data object, or an empty object if none exists.
 */
export function getUserData() {
    const data = localStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : {};
}

/**
 * Saves the general user data for the current session.
 * @param {object} data The user data object to save.
 */
export function setUserData(data) {
    localStorage.setItem(KEYS.USER_DATA, JSON.stringify(data));
}

/**
 * Retrieves a specific user's profile from localStorage.
 * @param {string} email The user's email.
 * @returns {object} The user's profile object, or an empty object.
 */
export function getUserProfile(email) {
    if (!email) return {};
    const data = localStorage.getItem(`${KEYS.USER_PROFILE_PREFIX}${email}`);
    return data ? JSON.parse(data) : {};
}

/**
 * Saves a specific user's profile to localStorage.
 * @param {string} email The user's email.
 * @param {object} data The profile data to save.
 */
export function setUserProfile(email, data) {
    if (!email) return;
    localStorage.setItem(`${KEYS.USER_PROFILE_PREFIX}${email}`, JSON.stringify(data));
}

/**
 * Logs the user out by clearing session data and redirecting to the login page.
 */
export function logout() {
    localStorage.removeItem(KEYS.LOGGED_IN_USER);
    window.location.href = 'login.html';
}

/**
 * Gets the wallet balance for the currently logged-in user.
 * @returns {number} The wallet balance.
 */
export function getWalletBalance() {
    const userId = getLoggedInUserId();
    const key = userId ? `${KEYS.WALLET_BALANCE_PREFIX}${userId}` : null;
    if (!key) return 0;
    const value = localStorage.getItem(key);
    return value ? Number(value) : 0;
}

/**
 * Sets the wallet balance for the currently logged-in user.
 * @param {number} amount The new balance.
 */
export function setWalletBalance(amount) {
    const userId = getLoggedInUserId();
    const key = userId ? `${KEYS.WALLET_BALANCE_PREFIX}${userId}` : null;
    if (key) {
        localStorage.setItem(key, String(amount));
    }
}

/**
 * Gets the saved application theme.
 * @returns {string} The saved theme ('day', 'night', 'system').
 */
export function getTheme() {
    return localStorage.getItem(KEYS.APP_THEME) || 'system';
}

/**
 * Saves the application theme.
 * @param {string} theme The theme to save ('day', 'night', 'system').
 */
export function setTheme(theme) {
    localStorage.setItem(KEYS.APP_THEME, theme);
}