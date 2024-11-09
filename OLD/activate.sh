# Source this . geospaces/activate.sh

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source $SCRIPTPATH/env

echo
echo source file as:  "'. $DEFAULT_APP/activate.sh'"
echo
echo "DEFAULT_APP environment is: ${DEFAULT_APP}"
echo "PORT : ${PORT}"

AP1="application_context"
AP2="${DEFAULT_APP}/application_context"

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then 
    echo "Runnig it directly $1"; 
else
    return
fi


if [ ${AP1} -ef ${AP2} ]; then 
    echo
    echo "** ALL GOOD: ${AP1} and ${AP2} are same. **"
    echo "To make a clean version - remove application_context and call again!"
    echo
else
    echo "----------- Setting up: $DEFAULT_APP $AP1 != $AP2"
    echo "Fixing it"
    echo
    echo $SCRIPTPATH
    make clean
    ln -s $SCRIPTPATH .
    ln -s $DEFAULT_APP/application_context .

    for i in "${NEED_APPS[@]}"
    do
        echo "Set links to $i"
    done
    echo "----- All done"
fi
