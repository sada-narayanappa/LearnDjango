#pipi -r requirements.txt
#python manage.py migrate
# run.py >/dev/null &
#
#export HOSTNAME=`hostname`
#echo $HOSTNAME

python manage.py runserver 0:8013
#DJANGO_SETTINGS_MODULE=aiapp.settings gunicorn -c rungunicorn.py mainapp.wsgi

