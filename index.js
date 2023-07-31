const axios = require('axios');

async function run() {
  try {
    const env = process.env.INPUT_ENV || 'dev';
    const ghcrUsername = process.env.INPUT_USERNAME || '';
    const ghcrToken = process.env.INPUT_PASSWORD || '';

    if (!ghcrUsername || !ghcrToken) {
      console.error('Error: GitHub Container Registry credentials are missing.');
      return;
    }

    await runDockerImage(env, ghcrToken);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runDockerImage(env, ghcrToken) {
  try {
    const headers = {
      'Authorization': `Bearer ${ghcrToken}`,
    };

    // Replace the following command with the appropriate command to run your Docker image
 
    const command = `docker run \
    -e GITHUB_TOKEN=${ghcrToken} \
    -e USER_NAME='pirasanthan-jesugeevegan' \
    -v "$(pwd)":/app \
    "ghcr.io/coincover/coincover-amt:latest" ${env}
`
    console.log('Running Docker image with command:', command);

    await executeCommand(command, headers);
  } catch (error) {
    console.log(error);
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
