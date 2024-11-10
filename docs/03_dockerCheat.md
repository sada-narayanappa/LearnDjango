# Simple Docker cheat sheet

```
NW=--network demonet
TAG=myapp
IMAGE=location/test:$TAG
NAME=myapp1

docker network ls | grep demonet ; if [ $? -ne 0 ]; then docker network create demonet ; fi
docker run --rm -it --name $NAME -p 8888:8888 -p 7003:7003  --network demonet $IMAGE

# If you want elastic search, uncomment the following line
export ESI="elastic -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.13.3"
#docker run --rm -it --name es01 - demonet -e ELASTIC_PASSWORD=${ESI}


echo ** To COMMIT YOUR IMAGE ***
	echo docker commit $NAME $TAG
	echo docker tag $TAG $IMAGE
	echo docker push $IMAGE 

docker commit $NAME $TAG; docker tag $TAG $IMAGE; docker push $IMAGE


#To run it on arm64 arch machines first install following:
docker run --privileged --rm tonistiigi/binfmt --install all
```

