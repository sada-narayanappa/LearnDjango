export NAME=geoapp
export ITAG=geoapp

build:
	docker build --tag=${ITAG} .

run:
	docker run -d -p 8003:8003 --rm --name ${NAME} ${ITAG}

runl:
	docker run -t -p 8003:8003 --rm --entrypoint /bin/bash --name ${NAME} ${ITAG}

all:
	gunicorn -c rungunicorn.py geoapp.wsgi

all1::
	gunicorn -c gunicorn.py geoapp.wsgi
	gunicorn geoapp.wsgi

venv:
	python3 -m venv venv && source venv/bin/activate
