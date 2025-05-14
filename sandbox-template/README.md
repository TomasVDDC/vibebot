// Build the docker container and connect to it locally
docker-compose up -d --build
docker-compose exec sandbox-template /bin/bash
