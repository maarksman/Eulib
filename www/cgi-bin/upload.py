#!C:\Python27\python.exe -u
#!\usr\bin\env python

import cgitb
import cgi
import datetime
import sqlite3
import json

cgitb.enable()
print 'Content-Type: application/json'
print
conn = sqlite3.connect('myDB.db')
cursor = conn.cursor()
