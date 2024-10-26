export PORT=8003

if [ $# -gt 0 ]; then
	export PORT=$1
fi

# uncomment the following to run in https mode
# OPTS=' --cert /tmp/cert'

export SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
echo ${SCRIPTPATH}
if [ -e "${SCRIPTPATH}/application_context" ]
then
    if [ -L "${SCRIPTPATH}/../application_context" ]
    then
        echo 'Removing ==>  "${SCRIPTPATH}/../application_context"'
        rm "${SCRIPTPATH}/../application_context"
    fi
    ln -s "${SCRIPTPATH}/application_context" "${SCRIPTPATH}/.."
else
    echo '"${SCRIPTPATH}/application_context" not found'
fi

#python -c "import os; print(os.path.abspath(os.getcwd()))"

cd "${SCRIPTPATH}/.."

if [ $# -lt 2 ]
then
    echo "RUNNING LOCAL server at ${PORT}"
    python manage.py runserver 0:${PORT} ${OPTS}
else
    echo "RUNNING GUNICORN server at ${PORT}"
    gunicorn -c gunicorn.config.py geoapp.wsgi
fi
