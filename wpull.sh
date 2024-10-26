git pull
for d in */ ; do
    if [ -e $d/.git ] 
    then
        echo "**Checking $d ..."
        cd $d; git pull; cd ..;
        echo
    fi
done