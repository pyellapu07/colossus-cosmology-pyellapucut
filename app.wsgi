#!/usr/bin/env python 
import os
import sys

os.environ['HOME'] = '/www/colossus'
sys.path.insert(0,"/www/colossus/venv/lib/python3.9/site-packages")
sys.path.insert(0,"/www/colossus/")
from app import app as application