// Load groups directly from public/groups.json
async function getGroups() {
  try {
    const response = await fetch('/groups.json');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to load groups:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error loading groups:', error);
    return [];
  }
}

// Load contact info directly from public/contact.json
async function getContact() {
  try {
    const response = await fetch('/contact.json');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to load contact:', response.status);
      return {};
    }
  } catch (error) {
    console.error('Error loading contact:', error);
    return {};
  }
}

// This file contains the API functions for communicating with the GitHub-based backend
// The actual groups rendering logic is in groups.js

// ... (truncated for brevity, will continue in next step) ... 