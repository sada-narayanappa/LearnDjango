find . -maxdepth 1 -type l 
echo "Removing links above ..."
echo
find . -maxdepth 1 -type l -exec rm {} \;
