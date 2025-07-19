import fs from 'fs';
import path from 'path';

// Path to the JSON file
const GROUPS_FILE = path.join(process.cwd(), 'data', 'groups.json');

// Read groups from JSON file
async function readGroupsFromFile() {
  try {
    const data = fs.readFileSync(GROUPS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Error reading groups file, returning empty array');
    return [];
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // GET /api/groups - Get all groups from JSON file
      const groups = await readGroupsFromFile();
      res.status(200).json(groups);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error reading groups:', error);
    res.status(500).json({ error: 'Failed to load groups' });
  }
} 