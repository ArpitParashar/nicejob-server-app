## Deployment to Google Compute Engine

#### Go to the root of the folder
#### Imp: all params are required for the scripts to run, maintain the order of arguments

1. Initial Deployment =: run => ./init-deploy.sh -a <project> -t <template> -g <instance-group> -p <port> -z <zone> /
        -r <replicas> -s <backend-service>

2. Continous Deployment =: run => ./version-deployment.sh -a <project> -g <instance-group> -z <zone>