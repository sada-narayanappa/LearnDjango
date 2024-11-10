# Using Django framework to build application

This is a application framework that use python Django-framework. 
This framework is created to quickly prototype web applications and show some good practices.

This framework is built to quickly develop web applications and shoul not be used for commercial applications.  I created this to quickly and easily build applications to show the proof of concept. 

You can start the application in few minutes and start bulilding applications.
This is to be used only for educational purpose and not suited for commercial application.

If you want to use it to deploy commercial applications, please contact the author.


---
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

### Youtube Video playlist:

https://youtube.com/playlist?list=PLEpvS3HCVQ58at6W2qxGoH8rWBTfNrq99

---
## Refences:
1. See here for more info
    https://github.com/sada-narayanappa/LearnDjango/blob/master/docs/01_first.md

# TO create app 

Make a copy of example_app
```
    cp -R example_app myapp
    mv myapp ..
    ln -s ../myapp .
    #save your my app to git and manage it
```

Now when you run it my_app will be included automatically

1. edit myapp/env and adjust the port etc.
2. edit myapp/application_context/settings.py to adjust the settings for your app

when you source myapp/env and run 'make run' - application will automatically 
setup the environments to your application

