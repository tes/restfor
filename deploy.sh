docker build -t restfor .
docker tag restfor:latest 856324650258.dkr.ecr.eu-central-1.amazonaws.com/restfor:latest
$(aws ecr get-login --no-include-email --region eu-central-1)
docker push 856324650258.dkr.ecr.eu-central-1.amazonaws.com/restfor:latest