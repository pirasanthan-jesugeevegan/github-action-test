#!/usr/bin/env bash
set -e

usage()
{
    echo "entrypoint.sh: this script runs cypress, generate a test report and upload it to S3."
    echo "" # new line
    echo "Params"
    echo "--env       What environment you want to run the test on."
    echo "--type      Select the type of test to run."
    echo "-h, --help  Will show this message"
    echo "" # new line
}

# defaults
env=''
type=''

# defaults list
listOfEnv=("dev" "stage")
listOfType=("api" "ui" "pt")

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --env )                      
            shift
            if [[ ! " ${listOfEnv[@]} " =~ " ${1} " ]]; then
                echo "Invalid value for --env. Allowed values are 'dev' or 'stage'."
                exit 1
            fi 
            env="$1"
            ;;
        --type )
            shift
            if [[ ! " ${listOfType[@]} " =~ " ${1} " ]]; then
                echo "Invalid value for --type. Allowed values are 'api', 'ui' or 'pt'."
                exit 1
            fi                       
            type="$1"
            ;;
        -h | --help )                   
            usage
            exit
            ;;
        * )
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
    shift
done

# Display the values of the parameters
echo "Env: $env"
echo "npx playwright test --project=$env"
npm install -D @playwright/test
npx playwright test --project=$env
