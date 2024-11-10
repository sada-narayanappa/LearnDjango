# Using Django framework to build application

This is a most comprehensive, simple fast django framework that will help you get started building world class applications.
There are hundreds of applications using this framework to deploy both simple and sophisticated applications.

This is a application framework that use python Django-framework. 
This framework is created to quickly prototype web applications and show some good practices.

This framework is built to quickly develop web applications and shoul not be used for commercial applications.  
It is created to quickly and easily build applications to show the proof of concept also able to deploy full fledged apps. 

You can start the application in few minutes and start bulilding your applications.
This is to be used only for educational purpose and not suited for commercial application.

If you want to use it to deploy commercial applications, please contact the author.

-------------------------------------------------------------------------------------------

## Quick start: get it up in few minutes

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

### Running it using docker

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

### Docker cheat sheet
```
    NW=--network demonet
    TAG=myapp
    IMAGE=location/test:$TAG
    NAME=myapp1

    docker network ls | grep demonet ; if [ $? -ne 0 ]; then docker network create demonet ; fi
    docker run --rm -it --name $NAME -p 8888:8888 -p 7003:7003  --network demonet $IMAGE

    # If you want elastic search, uncomment the following line
    export ESI = 'docker.elastic.co/elasticsearch/elasticsearch:8.13.3'
    #docker run --rm -it --name es01 - demonet -e ELASTIC_PASSWORD=elastic -p 9200:9200 $ESI


    echo ** To COMMIT YOUR IMAGE ***
        echo docker commit $NAME $TAG
        echo docker tag $TAG $IMAGE
        echo docker push $IMAGE 

    docker commit $NAME $TAG; docker tag $TAG $IMAGE; docker push $IMAGE


    #To run it on arm64 arch machines first install following:
    docker run --privileged --rm tonistiigi/binfmt --install all
```

----------------------------------------------------------------------------------------

you can view https://github.com/geospaces-org/docs/blob/main/django/docker.md for more information to deploy your own docker containers with your app

#### Next step:

Next step is to build and create your app: 
    https://github.com/geospaces-org/docs/blob/main/django/02_createapp.md

-------------------------------------------------------------------------------------------

## Some notable features

The Django framework, a high-level Python web framework, stands as a beacon of efficiency and simplicity in the world of web development. Born out of the need to create rapid, robust, and maintainable web applications, Django has become a go-to choice for developers and organizations.

At its core, Django embraces the “batteries-included” philosophy, offering an extensive array of built-in tools, libraries, and conventions that facilitate the development process. It simplifies complex tasks like URL routing, database integration, and user authentication, allowing developers to focus on building their applications.

Django also prioritizes security, making it less prone to common web vulnerabilities. It includes features like cross-site scripting (XSS) and cross-site request forgery (CSRF) protection out of the box. Offering a potent combination of speed, simplicity, and security, Django is an ideal choice for developers looking to create robust, feature-rich web applications with minimal effort.

### Features.

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
* Use database of your choice - postgres, simple SQLDB for quick deployment
* serve static files and application specific static files 
* Guidance and documentation for apache and NGINX servers.
* Deploying secured services and obtaining certificate from Lets Encrypt
* Cloud ready - tested on A=WS, openshift, Azure (Awaiting tests on Google cloud)

-------------------------------------------------------------------------------------------

## Contribute:

If you would like to contribute to the software, create a branch and add your code.
Please reach out to the current maintainer and request access. Start contributing to the open source code. 

Help millions of new innovations to pop in giving them a baseline.

-------------------------------------------------------------------------------------------

## Refences:

1. goto https://github.com/geospaces-org/docs/blob/main/django/docker.md to get all docs

