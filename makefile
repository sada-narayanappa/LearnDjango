# you can set port either by passing in by command line:
#   [ ]   make PORT=9000
# - OR 
# Set it by environment variable : EXPORT PORT=9000
# - OR it defaults to 8003
# ------------------------------------------------------------------------
SHELL  := env PORT=$(PORT) $(SHELL)
PORT ?= 8000

OPTS=' --cert /tmp/cert'

# ------------------------------------------------------------------------
info:
	@echo "* Show information: *"
	@echo "Runs your app on PORT: ${PORT}"
	@echo
# ------------------------------------------------------------------------
# Clean the links 
#
clean:
	@echo
	@echo "${PORT}"
	@echo "*** Will remove all the links ***: display links first"
	@echo
	@find . -maxdepth 1 -type l
	@find . -maxdepth 1 -type l -exec rm {} \;
	@find . -maxdepth 1 -type l
	@echo
	@echo "Removed above links"
# ------------------------------------------------------------------------
#
#
run:
	python activate.py
	python manage.py runserver 0:${PORT}

run_secure:
	python manage.py runserver_plus 0:${PORT} ${OPTS}

asgi:
	activate.py
	uvicorn --host 0.0.0.0  --port ${PORT}  geoapp.asgi:application --reload

# ------------------------------------------------------------------------
pull:
	@git pull
	@echo "Pulling sub directories ..."
	@for d in */ ; do \
		if [ -e $$d/.git ]; then	echo "==> $${d}";cd $$d; git pull; cd ..; fi \
	done
