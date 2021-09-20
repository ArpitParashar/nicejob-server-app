# Nice Job Server App

### Configuration for successfully running this app
1. Clone the repository
2. Place you service account json file downloaded in the config folder with the name 'service_account.json'
3. Create .env file following the env-template file
4. Where :
       1. PORT=<Port on which you app should run> ex. 3000
       2. LOCAL_CACHE_TTL=<max time for cache to expire> ex. 3600
       3. MAX_CACHE=<max size of cache in MB> ex. 64
       4. LOGGER_LEVEL= refer logger file
        refer https://cloud.google.com/compute/docs/reference/rest/v1/backendServices/getHealth for params below
       5. GOOGLE_API_SCOPE= 
       6. GOOGLE_PROJECT=
       7. GOOGLE_BACKEND_SERVICE=
       8. GOOGLE_RESOURCE_GROUP=

#### Prerequisites
1. Docker is installed
2. Service Account as it required to database package as well
3. That Service must have editor role for the project
### To run the app in a docker container in local
#### Running Local
1. npm install
2. npm run build
3. PROJECT_ID=my-app REVISION_ID=1 npm run docker:start
4. PROJECT_ID=my-app REVISION_ID=1 npm run docker:stop
#### Testing
PROJECT_ID=my-app REVISION_ID=1 npm run docker:test

### Description
This app is the companion app for the database package it checks the readOne, writeOne and readMany methods of the package

### Testing
Jest and supertest and used for testing the endpoints

### Health check for the services
This app also has the endpoint to check the health of the backend
http://34.117.29.162/health or http://localhost:3000/health


