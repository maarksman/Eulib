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

conn = MySQLdb.connect("localhost", "root", "mysql", "EulibDB")
cursor = conn.cursor()

#Empty table if you wanna
#cursor.execute('DROP TABLE IF EXISTS userinfo')

#creating table
results = cursor.execute('SELECT * FROM Article')
row = cursor.fetchone()

print "here?? <br>"
print
print len(row)

while row is not None:
    print row
    row = cursor.fetchone()


#inserting stuff in the table


#IF [NOT] EXISTS (SELECT 1 FROM userinfo WHERE email = email_client)


conn.close()
