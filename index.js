const axios = require('axios');
//
async function run() {
  try {
    const env = process.env.INPUT_ENV || 'dev';
    const ghcrUsername = process.env.INPUT_USERNAME || '';
    const ghcrPassword = process.env.INPUT_PASSWORD || '';

    if (!ghcrUsername || !ghcrPassword) {
      console.error('Error: GitHub Container Registry credentials are missing.');
      return;
    }

    const ghcrToken = await getGhcrToken(ghcrUsername, ghcrPassword);
    if (ghcrToken) {
      await runDockerImage(env, ghcrToken);
    } else {
      console.error('Failed to get GitHub Container Registry token.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getGhcrToken(username, password) {
  try {
    const response = await axios.post(
      'https://api.github.com/authorizations',
      {
        scopes: ['read:packages', 'write:packages'],
        note: 'GitHub Container Registry Access',
      },
      {
        auth: {
          username,
          password,
        },
      }
    );

    if (response.status === 201 && response.data.token) {
      return response.data.token;
    }
    return null;
  } catch (error) {
    throw new Error('Failed to get GitHub Container Registry token.');
  }
}

async function runDockerImage(env, ghcrToken) {
  try {
    const headers = {
      'Authorization': `Bearer ${ghcrToken}`,
    };

    // Replace the following command with the appropriate command to run your Docker image
    const command = `docker run ghcr.io/coincover/coincover-amt:latest ${env}`;
    console.log('Running Docker image with command:', command);

    await executeCommand(command, headers);
  } catch (error) {
    throw new Error('Error while running the Docker image.');
  }
}

async function executeCommand(command, headers) {
  const { exec } = require('child_process');

  return new Promise((resolve, reject) => {
    exec(command, { env: { ...process.env, ...headers } }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log('Docker output:', stdout);
        console.error('Docker errors:', stderr);
        resolve();
      }
    });
  });
}

run();
