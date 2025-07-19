// Simple localStorage-based storage (works immediately)
// This will be replaced with GitHub storage once environment variables are set up

// Load groups from localStorage
async function loadGroupsFromServer() {
  try {
    const data = localStorage.getItem('manjihub_groups_v1');
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading groups:', error);
    return [];
  }
}

// Save groups to localStorage
async function saveGroupsToServer(groups) {
  try {
    localStorage.setItem('manjihub_groups_v1', JSON.stringify(groups));
    return true;
  } catch (error) {
    console.error('Error saving groups:', error);
    return false;
  }
}

// Load contact info from localStorage
async function loadContactFromServer() {
  try {
    const data = localStorage.getItem('manjihub_contact_v1');
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading contact:', error);
    return {};
  }
}

// Save contact info to localStorage
async function saveContactToServer(contact) {
  try {
    localStorage.setItem('manjihub_contact_v1', JSON.stringify(contact));
    return true;
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