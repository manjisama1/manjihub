import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER || 'your-username';
const REPO = process.env.GITHUB_REPO || 'your-repo-name';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = 'data/groups.json';

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

// Read groups from GitHub
async function readGroupsFromGitHub() {
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
    console.log('No existing groups file, starting with empty array');
    return [];
  }
}

// Write groups to GitHub
async function writeGroupsToGitHub(groups) {
  try {
    const content = JSON.stringify(groups, null, 2);
    const sha = await getFileSHA();
    
    const params = {
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: `Update groups - ${new Date().toISOString()}`,
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
      // GET /api/groups - Get all groups from GitHub
      const groups = await readGroupsFromGitHub();
      res.status(200).json(groups);
    } else if (req.method === 'POST') {
      // POST /api/groups - Save groups to GitHub
      const groups = req.body;
      const success = await writeGroupsToGitHub(groups);
      
      if (success) {
        res.status(200).json({ success: true, message: 'Groups saved to GitHub' });
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