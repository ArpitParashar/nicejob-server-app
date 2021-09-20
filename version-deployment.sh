#!/bin/bash
if [ "$#" -ne 6 ]; then
    echo "Illegal number of parameters"
    exit 1
fi

while getopts z:a:g: flag
do
    case "${flag}" in
        a) project=${OPTARG};;
        g) group=${OPTARG};;
        z) zone=${OPTARG};;
    esac
done

echo "Project Id: $project"
echo "Instance Group: $group"
echo "Zone: $zone"

#Build the project
npm run build

# build docker image and push to gcr
docker build -t gcr.io/$project/image .
docker push gcr.io/$project/image 
# restart instances (this loads new images)
gcloud beta compute instance-groups managed rolling-action restart $group --zone $zone --project $project