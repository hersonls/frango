.PHONY: config
config:
	$(info ***************************************)
	$(info ************  Configuring  ************)
	$(info ***************************************)
	cd frontend && npm install -d && bower -V install
	cd backend && pip install -r requirements.txt
