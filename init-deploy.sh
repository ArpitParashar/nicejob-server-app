#!/bin/bash
if [ "$#" -ne 14 ]; then
    echo "Illegal number of parameters"
    exit 1
fi

while getopts a:t:g:p:z:r:s: flag
do
    case "${flag}" in
        a) project=${OPTARG};;
        t) template=${OPTARG};;
        g) group=${OPTARG};;
        p) port=${OPTARG};;
        z) zone=${OPTARG};;
        r) replicas=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

echo "Project Id: $project"
echo "Instance Template: $template"
echo "Instance Group: $group"
echo "Port to Map you app $port"
echo "Zone $zone"
echo "Num of Replicas $replicas"
echo "Backend Service Name $service"

# Build the project
npm run build

# Create a new Docker repository named quickstart-docker-repo 
#in the location us-central1 with the description "Docker repository":
docker build -t gcr.io/$project/image .
docker push gcr.io/$project/image 

#(requires to do `gcloud auth configure-docker`)

#Create instance template based on docker image pushed to gcr
gcloud compute instance-templates create-with-container $template \
     --container-image gcr.io/$project/image

#Create managed instance group based on created instance template in the location $zone
gcloud beta compute instance-groups managed create $group --zone $zone --template $template --size 1

#Set autoscaling for the managed instance groups
gcloud compute instance-groups managed set-autoscaling $group \
  --max-num-replicas $replicas \
  --target-cpu-utilization 0.60 \
  --cool-down-period 90

# Create a firewall to allow traffic at port $port
gcloud compute firewall-rules create www-firewall --allow tcp:$port

#Create a newtwork load balancer
#1. Create a health checke http-health-checks create http-basic-check
gcloud compute health-checks create http http-basic-check --port $port \
       --check-interval 30s \
       --healthy-threshold 1 \
       --timeout 10s \
       --unhealthy-threshold 3

#2. Define an HTTP service and map a port name to the relevant port for the instance group. Now the load balancing service can forward traffic to the named port:
  gcloud compute instance-groups managed set-named-ports $group --named-ports http:$port

#3 Create a backend service
gcloud compute backend-services create $service --protocol HTTP --health-checks http-basic-check --global

#4 Add instance group to backend service
gcloud compute backend-services add-backend $service \
    --instance-group $group \
    --instance-group-zone $zone \
    --global  

#5 creating a default URL map that directs all incoming requests to all the instances:
gcloud compute url-maps create web-map --default-service $service

#6 Create a target HTTP proxy to route requests to your URL map:
gcloud compute target-http-proxies create http-lb-proxy --url-map web-map

#7 Global forwarding rule to handle and route incoming requests
gcloud compute forwarding-rules create http-content-rule --global --target-http-proxy http-lb-proxy --ports 80


#8 Allow health checks
gcloud compute health-checks create http health-check --port 80 \
       --check-interval 30s \
       --healthy-threshold 1 \
       --timeout 10s \
       --unhealthy-threshold 3

#9 Create a firewall rule to allow health check probes to connect to your app.
gcloud compute firewall-rules create allow-health-check \
        --allow tcp:80 \
        --source-ranges 0.0.0.0/0,192.168.2.0/24 \
        --network default

#10 Use the update command to apply the health check to the MIG.
gcloud compute instance-groups managed update $group \
        --health-check health-check \
        --initial-delay 300 \
        --zone $zone