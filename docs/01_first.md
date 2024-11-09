# Using Django framework to build application

This is a application framework that use python Django-framework. 
This framework is created to quickly prototype web applications and show some good practices.

This framework is built to quickly develop web applications and shoul not be used for commercial applications.  
It is created to quickly and easily build applications to show the proof of concept also able to deploy full fledged apps. 

You can start the application in few minutes and start bulilding your applications.
This is to be used only for educational purpose and not suited for commercial application.

If you want to use it to deploy commercial applications, please contact the author.

-------------------------------------------------------------------------------------------
# Quick start: get it up in few minutes

### Option for local development

You can clone or fork the main repo and start building your app in few minutes.

Run the following commands
```
    git clone https://github.com/sada-narayanappa/LearnDjango.git
    cd LearnDjango
    pip install -r requirements.txt
    make run
```
If everything works as expected, you may navigate to http://localhost:8003

Now you have the base app working, you can start building your app.
see the videos and other documentations below.

### Option to create virtual environment
```{}
    # Option to create a venv 
    
    python3.12 -m venv ~/venv/py312
    alias py312="source ~/venv/py312/bin/activate"
    #add this to your ~/.aliases
    echo 'alias py312="source ~/venv/py312/bin/activate"' >> ~/.aliases
    py312
```

#### Youtube Video playlist:
https://youtube.com/playlist?list=PLEpvS3HCVQ58at6W2qxGoH8rWBTfNrq99

### Option using docker

Get it all working even faster if you are using docker. 

```
    [ ] export IMAGE=sada001/geo:geo-rhel9.21-django
    [ ] docker pull ${IMAGE}

    # create a network to use in docker compose

    [ ] export NW="--network demonet"
    [ ] docker network ls | grep demonet ; if [ $? -ne 0 ]; then docker network create demonet ; fi 

    # run the image and
    [ ] export PORTS="-p 8000:8000"
    [ ] export APP=django
    [ ] export TAGNAME=geo-rhel9.21-django

    [ ] docker run --rm -it  --name ${APP} ${MOUNTS} ${PORTS} ${NW} ${IMAGE} 'make run'
```
to customize your image 

```
    [ ] docker run --rm -it  --name ${APP} $(MOUNTS) $(PORTS) $(NW) $(TAGNAME) /bin/bash

    login and do changes and use commit and save it to your repo
    While running before closing

    [ ] export MY_IMAGE=<your DOCKERHUB end-point>:${TAGNAME}
    [ ] docker commit ${APP} ${TAGNAME}; docker tag ${TAGNAME} ${IMAGE}; docker push ${MY_IMAGE}
    
```


you can view https://github.com/geospaces-org/docs/blob/main/django/docker.md for more information to deploy your own docker containers with your app

#### Next step:

Next step is to build and create your app: 
    https://github.com/geospaces-org/docs/blob/main/django/02_createapp.md

-------------------------------------------------------------------------------------------

## Some notable features

* Developed by 100's of researchers, interns, PhD students/professors and top engineers.
* Continuosly being developed - well thought out design and simple elegant architecture.
* Fully configurable and with all source code for your needs.
* MIT license - so no need to worry to use or reuse or modify to your needs.
* Simple framework and powerful to deploy application for 1000's of users.
* Deployinstantly using **docker** container, **kubernetis** deployment.
* Develop applications using python.
* Metrics for user visits, most used pages, landing page statistics.
* Plug and play your applications and easily integrate other 100's application modules
* Builtin features:
    * Login, registration, single sign on, social media sign on
    * Stripe interface to accept payments
    * Many open free applications (such as blogs, stocks, etc.)
    * community contributed modules
    * Simple solutions for emails, uploading files, etc.
    * secuirty and ability to secure applications
    * Quickly develop python apps, deploy them as web services
* If you need consulting in hosting or want help with customizing app, consulting service
* contribute to open source by reaching out - help to build great innovations
* Many users already using the system
-------------------------------------------------------------------------------------------
# Contribute:

If you would like to contribute to the software, create a branch and add your code.
Please reach out to the current maintainer and request access. Start contributing to the open source code. 

Help millions of new innovations to pop in giving them a baseline.

-------------------------------------------------------------------------------------------
# Refences:

1. goto https://github.com/geospaces-org/docs/blob/main/django/docker.md to get all docs

