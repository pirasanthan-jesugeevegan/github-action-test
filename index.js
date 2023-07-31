const axios = require('axios');
const env = process.env.INPUT_ENV || 'dev';
const ghcrUsername = process.env.INPUT_USERNAME || '';
const ghcrToken = process.env.INPUT_PASSWORD || '';

async function run() {
  try {
    if (!ghcrUsername || !ghcrToken) {
      console.error(
        'Error: GitHub Container Registry credentials are missing.'
      );
      return;
    }

    await runDockerImage(env, ghcrUsername, ghcrToken);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runDockerImage(env, ghcrUsername, ghcrToken) {
  try {
    const headers = {
      Authorization: `Bearer ${ghcrToken}`,
    };

    const loginCommand = `echo ${ghcrToken} | docker login ghcr.io -u ${ghcrUsername} --password-stdin`;
    const runCommand = `docker run -e GITHUB_TOKEN=${ghcrToken} -v "$(pwd)":/app "ghcr.io/coincover/coincover-amt:latest" ${env}`;

    const command = `${loginCommand} && ${runCommand}`;
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
    exec(
      command,
      { env: { ...process.env, ...headers } },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log('Docker output:', stdout);
          console.error('Docker errors:', stderr);
          resolve();
        }
      }
    );
  });
}

run();
