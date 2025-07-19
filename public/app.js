// Backend API endpoints for groups
const API_BASE = window.location.origin;

// Load groups from server
async function loadGroupsFromServer() {
  try {
    const response = await fetch(`${API_BASE}/api/groups`);
    if (response.ok) {
      const groups = await response.json();
      return groups;
    } else {
      console.error('Failed to load groups:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error loading groups:', error);
    return [];
  }
}

// Save groups to server
async function saveGroupsToServer(groups) {
  try {
    const response = await fetch(`${API_BASE}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groups)
    });
    
    if (response.ok) {
      return true;
    } else {
      console.error('Failed to save groups:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error saving groups:', error);
    return false;
  }
}

// Load contact info from server
async function loadContactFromServer() {
  try {
    const response = await fetch(`${API_BASE}/api/contact`);
    if (response.ok) {
      const contact = await response.json();
      return contact;
    } else {
      console.error('Failed to load contact:', response.status);
      return {};
    }
  } catch (error) {
    console.error('Error loading contact:', error);
    return {};
  }
}

// Save contact info to server
async function saveContactToServer(contact) {
  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact)
    });
    
    if (response.ok) {
      return true;
    } else {
      console.error('Failed to save contact:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error saving contact:', error);
    return false;
  }
}

// Fallback to localStorage if server is not available
function getGroups() {
  // Try server first, fallback to localStorage
  return loadGroupsFromServer().catch(() => {
    const data = localStorage.getItem('manjihub_groups_v1');
    if (data) {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  });
}

function saveGroups(groups) {
  // Try server first, fallback to localStorage
  return saveGroupsToServer(groups).then(success => {
    if (!success) {
      localStorage.setItem('manjihub_groups_v1', JSON.stringify(groups));
    }
    return success;
  }).catch(() => {
    localStorage.setItem('manjihub_groups_v1', JSON.stringify(groups));
    return false;
  });
}

function getContact() {
  // Try server first, fallback to localStorage
  return loadContactFromServer().catch(() => {
    const data = localStorage.getItem('manjihub_contact_v1');
    if (data) {
      try { return JSON.parse(data); } catch { return {}; }
    }
    return {};
  });
}

function saveContact(contact) {
  // Try server first, fallback to localStorage
  return saveContactToServer(contact).then(success => {
    if (!success) {
      localStorage.setItem('manjihub_contact_v1', JSON.stringify(contact));
    }
    return success;
  }).catch(() => {
    localStorage.setItem('manjihub_contact_v1', JSON.stringify(contact));
    return false;
  });
}

// This file contains the API functions for communicating with the GitHub-based backend
// The actual groups rendering logic is in groups.js

// ... (truncated for brevity, will continue in next step) ... 