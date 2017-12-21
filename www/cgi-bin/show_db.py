#!C:\Python27\python.exe -u
#!\usr\bin\env python

import cgitb
import cgi
import datetime
import sqlite3
import json

cgitb.enable()

conn = sqlite3.connect('register.db')
cursor = conn.cursor()
print 'Content-Type: text/html'
print

table = 'userinfo'


print '''Database<br/>'''
for r in cursor.execute('SELECT * FROM ' + table +';'):
    print '''<p>''', r, '''</p>'''
    print '''<br/>'''









conn.commit()
conn.close()
