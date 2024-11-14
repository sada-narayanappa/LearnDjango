export DEFAULT_APP=$1
echo Setting up and running $DEFAULT_APP

activate.py $DEFAULT_APP
make run DEFAULT_APP=$DEFAULT_APP