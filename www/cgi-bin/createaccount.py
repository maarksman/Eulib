#!C:\Python27\python.exe -u
#!\usr\bin\env python

import cgitb
import cgi

import sqlite3
import json
import hashlib

cgitb.enable()
print 'Content-Type: text/html'
print

conn = sqlite3.connect('register.db')
cursor = conn.cursor()

form = cgi.FieldStorage()

username_client = form['username'].value
password_client = form['password'].value

data = {}

for user in cursor.execute('''SELECT password,currenttime FROM userinfo WHERE username=?;''' ,[username_client]):
    data['password']=user[0]
    data['currenttime']=user[1]

print "<p>"+json.dumps(data)+"</p>"
# print "<p> pass:"
# print data['password']
# print "</p>"

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

conn.close()
