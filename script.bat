@echo off
py -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
set FLASK_APP=main.py
set FLASK_ENV=development
flask run
