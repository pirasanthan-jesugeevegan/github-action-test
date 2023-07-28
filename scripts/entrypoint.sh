#!/usr/bin/env bash
set -e

usage()
{
    echo "entrypoint.sh:  this script runs cypress, generate a test report and upload it to S3."
    echo "" # new line
    echo "Params"
    echo "--env       What environment you want to run the test on."
    echo "-h, --help     Will show this message"
    echo "" # new line
}

# defaults
env=''
# defaults list
listOfEnv=("dev" "stage")

while [ "$1" != "" ]; do
    case $1 in
        --env )                      
            if [[ ! " ${listOfEnv[@]} " =~ " ${2} " ]]; then
                echo "Invalid value for --env. Allowed values are 'dev' or 'stage'."
                exit 1
            fi 
            env="$2"
            ;;
        -h | --help )                   
            usage
            exit
            ;;
    esac
    shift
done


# Display the values of the parameters
echo "Env: $env"

npm install -D @playwright/test
npx playwright test --project=$env
