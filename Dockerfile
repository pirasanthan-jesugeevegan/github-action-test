FROM ghcr.io/coincover/coincover-amt:base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the Docker image
COPY package.json package-lock.json /app/

RUN JAVA_HOME="$(dirname $(dirname $(readlink -f $(which javac))))" && \
    echo "export JAVA_HOME=$JAVA_HOME" >> /etc/profile.d/java.sh && \
    echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> /etc/profile.d/java.sh && \
    chmod +x /etc/profile.d/java.sh

# Reload the environment variables
RUN . /etc/profile.d/java.sh

RUN npm install

# Run the Playwright install command to download browsers
RUN npx playwright install

# Copy everything from the local directory to the Docker image
COPY . /app

# Set executable permissions for the entrypoint.sh script
RUN chmod +x /app/scripts/entrypoint.sh
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
