#	podman  build --tag=geo-rhel9.21 -f Dockertest 
#	podman  build --tag=geo-rhel9.2 -f Dockerfile-rhel9-cpu 
HOST_PORT1=8888
DOCK_PORT1=8888
PORTS2=9000-9001:9000-9001

PORTS=-p $(HOST_PORT1):${DOCK_PORT1} -p $(PORTS2) 

TAGNAME=geo-rhel9.21-jupyter
DOCKERFILE=Dockerfile-rhel9-cpu-jupyter

BASENAME=geo-rhel9.21-base
DOCKERBASE=Dockerfile-rhel9-cpu-base

NW=--network demonet
MOUNTS=-v ~/notebooks/:/notebooks

DOCKERHUB=sada001/geo
base:
	#docker network create demonet 
	docker  build --tag=$(BASENAME) -f $(DOCKERBASE) .

base-push:
	docker tag $(TAGNAME) $(DOCKERHUB):$(TAGNAME)
	docker push $(DOCKERHUB):$(TAGNAME)
	docker tag  $(DOCKERHUB):$(TAGNAME) $(TAGNAME)

base-pull:
	docker pull $(DOCKERHUB):$(TAGNAME)

# ------------------------------- JUPYTER
jupyter:
	docker  build --tag=$(TAGNAME) -f $(DOCKERFILE) .

jup-run:
	docker run --rm -d  --name note1 $(MOUNTS) $(PORTS) -e "ENV=1" $(NW) $(TAGNAME) 

jup-bash:
	#docker run -it note1 bash
	docker exec -it note1 bash 


# ------------------------------- POSTGRES
export MVOL=-v ~/postgres/data:/var/lib/postgresql/data
export POPTS=-e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=
export PGPORTS=-p 5432:5432
postgis:
	#docker pull postgis/postgis
	docker run -itd ${POPTS} ${MVOL} -p 5432:5432 --name postgis postgis/postgis

postgres-run:
	#docker pull postgres
	#apt-get update -y
	#apt-get install -y iputils-ping

	docker run --rm -itd ${POPTS} ${MVOL} ${PGPORTS} --name postgres $(NW) postgres

postgres-bash:
	docker exec -it postgres bash


# ------------------------------- DJANGO
DJANGO_TAGNAME=geo-rhel9.21-learndjango
DJANGO_DOCFILE=Dockerfile-rhel9-cpu-learndjango
DJANGO_PORTS=-p 8013:8013
DJANGO_MOUNTS=

learndjango:
	docker  build --tag=$(DJANGO_TAGNAME) -f $(DJANGO_DOCFILE) .

learndjango-run:
	docker run --rm -d  --name django1 $(DJANGO_MOUNTS) $(DJANGO_PORTS) $(NW) $(DJANGO_TAGNAME)

learndjango-bash:
	docker exec -it django1 bash 

# ------------------------------- STREAM DEVELOPMENT
export STREAM_TAGNAME=geo-rhel9.21-streamdev
export STREAM_DOCFILE=Dockerfile-rhel9-cpu-streamdev
export STREAM_PORTS=-p 7003:7003
export STREAM_MOUNTS=
#GIT_USERNAME=git_user
#GIT_PASSWORD=git_pass

streamdev:
	docker  build --build-arg="username=$(GIT_USERNAME)"  --build-arg="password=$(GIT_PASSWORD)" --tag=$(STREAM_TAGNAME) -f $(STREAM_DOCFILE) .

streamdev-run:
    #docker network create demonet
	echo docker run --rm -d  --name stream1 ${STREAM_MOUNTS} -p8888:8888 ${STREAM_PORTS} ${NW} ${STREAM_DOCFILE}

streamdev-bash:
	docker exec -it stream1 bash 


streamdev1-run:
	docker run --rm -d --name stream -p 8888:8888 -p7003:7003  --network demonet  sada001/geo:streamdev
