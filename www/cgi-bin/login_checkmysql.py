#!C:\Python27\python.exe -u
#!\usr\bin\env python

import cgitb
import cgi
import datetime
import MySQLdb
import json
import hashlib

cgitb.enable()
print 'Content-Type: text/html'
print
print "<p> here? </p>"
conn = MySQLdb.connect("localhost", "root", "mysql", "EulibDB")
cursor = conn.cursor()

form = cgi.FieldStorage()

username_client = form['username'].value
password_client = form['password'].value

data = {}

find_user_query = cursor.execute('''SELECT password, currenttime FROM User WHERE username = %s''', (username_client,))
row = cursor.fetchone()

while row is not None:
    data['password'] = row[0]
    data['currenttime'] = row[1]
cursor.close()
conn.close()

#print "<p>"+json.dumps(data)+"</p>"
#print "<p> pass:"
#print data['password']
#print "</p>"

password_hashed = hashlib.md5()

password_hashed.update(password_client)
password_hashed.update(data['currenttime'])
password_hashed=password_hashed.hexdigest()

if password_hashed == data['password']:
    print "<p>password matches</p>"
else:
    print "<p>error</p>"
    print "<p>"
    print password_hashed +" != " + data['password']
    print "</p>"
