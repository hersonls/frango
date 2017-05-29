#!/bin/sh

gunicorn --timeout 120  --workers=2 backend.wsgi
