BASENAME=geo-rhel9.21-base
BASENAME-gpu=geo-rhel9.21-base-gpu
DOCKERBASE=Dockerfile-rhel9-cpu-base
DOCKERBASE-gpu=Dockerfile-ubuntucuda11.4
DOCKERHUB=sada001/geo
# ------------------------------- CREATE BASE IMAGE
base:
	docker  build --tag=$(BASENAME) -f $(DOCKERBASE) .

base-gpu:
	docker  build --tag=$(BASENAME) -f $(DOCKERFILEgpu) .

# You can push the image to doker repo 
# make sure you login using 'docker login --username sada001 #or whatever username you want'
base-push:
	docker tag $(BASENAME) $(DOCKERHUB):$(BASENAME)
	docker push $(DOCKERHUB):$(BASENAME)
	docker tag  $(DOCKERHUB):$(BASENAME) $(BASENAME)

# You can just pull the base image - without having to build it
base-pull:
	docker pull $(DOCKERHUB):$(BASENAME)
# -------------------------------------------------- CREATE NW
NW=--network demonet
nw:
	docker network ls | grep demonet ; if [ $? -ne 0 ]; then docker network create demonet ; fi 
# -------------------------------------------------- DJANGO
django_vars:
	$(eval TAGNAME=geo-rhel9.21-django)
	$(eval DOCFILE=Dockerfile-rhel9-cpu-django)
	$(eval PORTS=-p 8000:8000)
	$(eval MOUNTS=)
	$(eval APP=django)
	$(eval IMAGE=${DOCKERHUB}:${TAGNAME})

django: django_vars
	# See --build-arg="password=${DJ_PASSWORD}" to modify the building
	cd ..; docker  build --tag=$(TAGNAME) -f deploy/$(DOCFILE) .

djangon: django_vars
	cd ..; docker  build --no-cache=true  --tag=$(TAGNAME) -f deploy/$(DOCFILE) .

django-run: django_vars
	docker run --rm -d  --name ${APP} $(MOUNTS) $(PORTS) $(NW) $(TAGNAME)

django-runit: django_vars
	docker run --rm -it  --name ${APP} $(MOUNTS) $(PORTS) $(NW) $(TAGNAME) 'make run'

django-runitbash: django_vars
	docker run --rm -it  --name ${APP} $(MOUNTS) $(PORTS) $(NW) $(TAGNAME) /bin/bash

django-bash: django_vars
	docker exec -it ${APP} bash 

django-stop: django_vars
	docker stop ${APP}

django-kill: django_vars
	docker kill ${APP}

# Commit the running COPY
django-commit: django_vars
	@echo "Configure this and push specific images to your docker repo"
	@echo
	@echo docker commit ${APP} ${TAGNAME}
	@echo docker tag ${TAGNAME} ${IMAGE}
	@echo docker push ${IMAGE} 
	@echo 'docker commit ${NAME} ${TAGNAME}; docker tag ${TAGNAME} ${IMAGE}; docker push ${IMAGE}'


# ------------------------------- TESTING MAKEFILE setting variables
test1:
	@echo "${APP}"
test2:
	$(eval APP=django1)
	@echo "${APP}"
test3: test1
	@echo "${APP}"
# ------------------------------- JUPYTER = NEED TO FIX THIS Later 
DOCKERFILE=Dockerfile-rhel9-cpu-jupyter
TAGNAME=geo-rhel9.21-jupyter
JUP_MOUNTS=-v ~/notebooks/:/notebooks
HOST_PORT1=8888
DOCK_PORT1=8888
PORTS2=9000-9001:9000-9001
JUP_PORTS=-p $(HOST_PORT1):${DOCK_PORT1} -p $(PORTS2) 

jupyter:
	docker  build --tag=$(TAGNAME) -f $(DOCKERFILE) .

jup-run: nw
	docker run --rm -d  --name note1 $(JUP_MOUNTS) $(PORTS) -e "ENV=1" $(NW) $(TAGNAME) 

jup-bash:
	#docker run -it note1 bash
	docker exec -it note1 bash 

jup-push:
	docker tag $(TAGNAME) $(DOCKERHUB):$(TAGNAME)
	docker push $(DOCKERHUB):$(TAGNAME)
	docker tag  $(DOCKERHUB):$(TAGNAME) $(TAGNAME)

jup-pull:
	docker pull $(DOCKERHUB):$(TAGNAME)

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

