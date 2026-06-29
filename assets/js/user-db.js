// --- GLOBAL CENTRAL DATABASE CONFIGURATION ---
// This file centralizes your user profile log sync pipelines.
const CLOUD_DB_URL = "https://kvdb.io/MN86yFwZ3q2g6YpL9qWvj7/gamerack_users_list";

/**
 * Fetches the entire user registry list array from the central cloud database node.
 * @returns {Promise<Array>} Array of registered user objects
 */
async function fetchCloudUsers() {
    try {
        const response = await fetch(CLOUD_DB_URL);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Cloud Database Read Telemetry Error:", err);
        return [];
    }
}

/**
 * Saves and overrides the user registry list array on the cloud storage container.
 * @param {Array} usersArray The updated array containing all user profile structures
 * @returns {Promise<boolean>} True if transaction commits successfully
 */
async function saveCloudUsers(usersArray) {
    try {
        const response = await fetch(CLOUD_DB_URL, {
            method: 'POST',
            body: JSON.stringify(usersArray),
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (err) {
        console.error("Cloud Database Write Telemetry Error:", err);
        return false;
    }
}

/**
 * Directly appends a single new user account node to the cloud tracking logs.
 * @param {Object} newUser An object containing { name, email, password, avatar }
 * @returns {Promise<boolean>} True if user successfully saved to the cloud matrix
 */
async function registerNewCloudUser(newUser) {
    // 1. Fetch current up-to-date registry lists over the wire
    let currentUsersList = await fetchCloudUsers();
    
    // 2. Prevent duplicate entries if they somehow submit twice
    if (!currentUsersList.some(user => user.email === newUser.email)) {
        currentUsersList.push(newUser);
    }
    
    // 3. Post back the expanded list to kvdb.io mapping array records
    return await saveCloudUsers(currentUsersList);
}