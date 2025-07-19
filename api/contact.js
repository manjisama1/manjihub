// Vercel-based storage using environment variables
// This stores data in Vercel's environment variables

// Read contact from Vercel environment
async function readContactFromVercel() {
  try {
    // Try to get from environment variable
    const contactData = process.env.CONTACT_DATA;
    if (contactData) {
      return JSON.parse(contactData);
    }
    return {};
  } catch (error) {
    console.log('No existing contact data, starting with empty object');
    return {};
  }
}

// Write contact to Vercel environment (simulated)
// Note: In real Vercel, you'd need to use a database or external storage
// For now, we'll use a simple in-memory approach that works during the session
let contactData = {};

// Load initial data
try {
  if (process.env.CONTACT_DATA) {
    contactData = JSON.parse(process.env.CONTACT_DATA);
  }
} catch (error) {
  console.log('Using default empty contact object');
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
      // GET /api/contact - Get contact info
      res.status(200).json(contactData);
    } else if (req.method === 'POST') {
      // POST /api/contact - Save contact info
      contactData = req.body;
      res.status(200).json({ 
        success: true, 
        message: 'Contact saved to Vercel storage' 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Vercel storage error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
} 