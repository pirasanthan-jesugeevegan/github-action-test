#!/bin/sh -l

echo $2 | docker login ghcr.io -u $1 --password-stdin
# Build image with current revision, caching from latest
docker pull ghcr.io/coincover/coincover-amt:latest

docker run \
  -e GITHUB_TOKEN=$2 \
  -e USER_NAME=$1 \
  "ghcr.io/coincover/coincover-amt:latest" --env $3 --type $4 --product $5 --file demo

# Find the container ID of the last executed container (assuming it's the only one)
container_id=$(docker ps -lq)

# Copy result.json from the root of the container to the host
docker cp "$container_id:/app/results.json" "$(pwd)/result.json"

passed_tests=$(jq '[.suites[].suites[].specs[].tests[] | select(.results[0].status == "passed")] | length' "$(pwd)/result.json")
failed_tests=$(jq '[.suites[].suites[].specs[].tests[] | select(.results[0].status != "passed")] | length' "$(pwd)/result.json")

echo "passed=Number of passed tests: $passed_tests" >> $GITHUB_OUTPUT
echo "failed=Number of failed tests: $failed_tests" >> $GITHUB_OUTPUT

# Check if there are any failed tests
if [ "$failed_tests" -gt 0 ]; then
    echo "status=Some tests failed." >> $GITHUB_OUTPUT
else
     echo "status=All tests passed." >> $GITHUB_OUTPUT
fi