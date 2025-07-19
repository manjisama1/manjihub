import fs from 'fs';
import path from 'path';

// Path to the JSON file
const CONTACT_FILE = path.join(process.cwd(), 'data', 'contact.json');

// Read contact from JSON file
async function readContactFromFile() {
  try {
    const data = fs.readFileSync(CONTACT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Error reading contact file, returning empty object');
    return {};
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
      // GET /api/contact - Get contact info from JSON file
      const contact = await readContactFromFile();
      res.status(200).json(contact);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error reading contact:', error);
    res.status(500).json({ error: 'Failed to load contact info' });
  }
} 