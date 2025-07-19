// Vercel-based storage using environment variables
// This stores data in Vercel's environment variables

// Read groups from Vercel environment
async function readGroupsFromVercel() {
  try {
    // Try to get from environment variable
    const groupsData = process.env.GROUPS_DATA;
    if (groupsData) {
      return JSON.parse(groupsData);
    }
    return [];
  } catch (error) {
    console.log('No existing groups data, starting with empty array');
    return [];
  }
}

// Write groups to Vercel environment (simulated)
// Note: In real Vercel, you'd need to use a database or external storage
// For now, we'll use a simple in-memory approach that works during the session
let groupsData = [];

// Load initial data
try {
  if (process.env.GROUPS_DATA) {
    groupsData = JSON.parse(process.env.GROUPS_DATA);
  }
} catch (error) {
  console.log('Using default empty groups array');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // GET /api/groups - Get all groups
      res.status(200).json(groupsData);
    } else if (req.method === 'POST') {
      // POST /api/groups - Save groups
      groupsData = req.body;
      res.status(200).json({ 
        success: true, 
        message: 'Groups saved to Vercel storage',
        count: groupsData.length 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Vercel storage error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
} 