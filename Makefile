.PHONY: config
config:
	$(info ***************************************)
	$(info ************  Configuring  ************)
	$(info ***************************************)
	cd frontend && yarn -d && bower -V install
	cd backend && pip install -r requirements.txt
