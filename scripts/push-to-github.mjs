import fs from 'fs';
import path from 'path';

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'NotHareesh';
const REPO = 'StudyOS';
const BRANCH = 'main';

if (!TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is not set.');
  process.exit(1);
}

const IGNORED_PATHS = [
  'node_modules',
  '.next',
  '.git',
  '.env.local',
  'dist',
  'build',
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (IGNORED_PATHS.some((ignored) => relativePath.startsWith(ignored))) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
}

async function uploadFile(filePath) {
  const content = fs.readFileSync(filePath);
  const base64Content = content.toString('base64');
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;

  let sha = undefined;
  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `token ${TOKEN}`,
        'User-Agent': 'StudyOS-Pusher',
      },
    });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
  } catch (e) {
    // File doesn't exist yet
  }

  const body = {
    message: `Add/Update ${filePath}`,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'StudyOS-Pusher',
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    console.log(`✓ Uploaded ${filePath}`);
  } else {
    const err = await res.text();
    console.error(`✗ Failed ${filePath}: ${err}`);
  }
}

async function main() {
  const files = getAllFiles(process.cwd());
  for (const f of files) {
    await uploadFile(f);
  }
  console.log('Push complete!');
}

main().catch(console.error);
