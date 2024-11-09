# Creating your application in minutes

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


