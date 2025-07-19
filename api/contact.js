import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER || 'your-username';
const REPO = process.env.GITHUB_REPO || 'your-repo-name';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = 'data/contact.json';

// Get current file SHA (required for updates)
async function getFileSHA() {
  try {
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      ref: BRANCH
    });
    return response.data.sha;
  } catch (error) {
    console.log('File does not exist, will create new');
    return null;
  }
}

// Read contact from GitHub
async function readContactFromGitHub() {
  try {
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      ref: BRANCH
    });
    
    const content = Buffer.from(response.data.content, 'base64').toString();
    return JSON.parse(content);
  } catch (error) {
    console.log('No existing contact file, starting with empty object');
    return {};
  }
}

// Write contact to GitHub
async function writeContactToGitHub(contact) {
  try {
    const content = JSON.stringify(contact, null, 2);
    const sha = await getFileSHA();
    
    const params = {
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: `Update contact - ${new Date().toISOString()}`,
      content: Buffer.from(content).toString('base64'),
      branch: BRANCH
    };

    if (sha) {
      params.sha = sha;
    }

    await octokit.repos.createOrUpdateFileContents(params);
    return true;
  } catch (error) {
    console.error('Error writing to GitHub:', error);
    return false;
  }
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
      // GET /api/contact - Get contact info from GitHub
      const contact = await readContactFromGitHub();
      res.status(200).json(contact);
    } else if (req.method === 'POST') {
      // POST /api/contact - Save contact info to GitHub
      const contact = req.body;
      const success = await writeContactToGitHub(contact);
      
      if (success) {
        res.status(200).json({ success: true, message: 'Contact saved to GitHub' });
      } else {
        res.status(500).json({ error: 'Failed to save to GitHub' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'GitHub operation failed' });
  }
} 