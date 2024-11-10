# Create Docker container and using it.

```
* NOTE * : you can directly pull the image from docker - you do not need to build local images.

```
#### Pre-requisite 

* You must be familiar with docker (containerization) concepts

* NOTE: You must know how to create a account on docker hub. You must also be familar with pushing and pulling images from docker hub or some some docker repository. 

## Build docker image - STEP by STEP
In order to build the docker container, see the makefile in deploy directory.
Here first lets focus on build cpu-image - ok?

If you read 'Dockerfile-rhel9-cpu-base' - we will build from rhel image and install utilities and python 3.2

You can build the base image using the command:
The following command will:

  * create a dcoker image named 'geo-rhel9.21-base';
  * a python3.12 and create a user named 'poduser' with some decent bash profiles.
  * installs standard pythin packages 

```
make base
```
You can check docker images:

```
  [ ] docker images ls
  OUT >>

  REPOSITORY                                      TAG         IMAGE ID       CREATED          SIZE
  geo-rhel9.21-base                               latest      634504c41838   44 seconds ago   1.52GB
```

------------------------------------------------------------------------------------

## Build the image for the application

In this section, we will see how to build base coker image and push it to docker hub.
If you create your own, you can build and push your image ad you customize it.

This is the tricky part and depending on how it goes, you may have to know how docker works and do somethings manually.
Run the following command to build it from scratch. 

*NOTE*: You can always download the image from docker-hub and skip this step; add your customization and make your life easier.
But if you want to get to nittygritty details, here it is:

run:
```
  [ ] make django  # This will create a image named 'geo-rhel9.21-django'

  [ ] docker images ls
  OUT >>

  REPOSITORY                                      TAG         IMAGE ID       CREATED          SIZE
  geo-rhel9.21-base                               latest      634504c41838   44 seconds ago   1.52GB
  geo-rhel9.21-django                             latest              755c1c1dfe3c   About a minute ago   1.84GB
```

You may run the image on default port and start the app as follows:
```
 [ ] make django-runit
```

### Some tweaks you need to do manually
```
  [ ] make django-runitbash
   @dock [~/git/DS/apps ] => RUN python manage.py createsuperuser --username=pod --email=''
   OUT>> use password; I would use 'pod'

  # you may have to set some thing manualluy
```

And then push the image to docker hub.

Once you do this manually, you may commit the image to the hub by
```
 [ ] make django-commit
```

------------------------------------------------------------------------------------

## Build Jupyter notebook image (optional - extra credit)
This section shows how to extend the base image for specific use case.
Her eyou create a jupyter notebook image and optionally push it to remote repo for distribution and sharing.

The action is pretty fast - because we are just creating an entry point.

```
  [ ] make jupyter # will do the job

  [ ] docker images ls
  OUT >>

  REPOSITORY                                      TAG         IMAGE ID       CREATED          SIZE
  geo-rhel9.21-base                               latest      634504c41838   44 seconds ago   1.52GB
  geo-rhel9.21-jupyter                            latest              5d5bb3e97699   29 minutes ago   1.52GB
```
Please see the makefile for other destinations such as: 
  * jup_run
  * jup-bash
  * jup-push
  * ... etc.

------------------------------------------------------------------------------------

## FAQ

To run it on arm64 arch machines first install following:
docker run --privileged --rm tonistiigi/binfmt --install all

------------------------------------------------------------------------------------

## GOOD REFERENCES

1. https://spacelift.io/blog/docker-entrypoint-vs-cmd

