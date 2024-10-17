export PORT=8003

if [ $# -gt 0 ]; then
	export PORT=$1
fi

# uncomment the following to run in https mode
OPTS=' --cert /tmp/cert'


if [ $# -lt 2 ]
then
    echo "RUNNING LOCAL server at ${PORT}"
    python manage.py runserver 0:${PORT} ${OPT}
else
    echo "RUNNING GUNICORN server at ${PORT}"
    gunicorn -c gunicorn.config.py geoapp.wsgi
fi
