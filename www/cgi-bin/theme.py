#!C:\Python27\python.exe -u
#!\usr\bin\env python


import cgitb
import cgi
import datetime
import MySQLdb
import json
import hashlib


cgitb.enable()

print 'Content-Type: application/json'
print

conn = MySQLdb.connect("localhost", "root", "mysql", "EulibDB")
cursor = conn.cursor()

data = {}

find_theme = cursor.execute('''SELECT theme FROM user WHERE username = %s''', (username_client));
row = cursor.fetchone()

while row is not None:
    data['theme'] = row[0];

cursor.close()
conn.close()

print json.dumps(data)
