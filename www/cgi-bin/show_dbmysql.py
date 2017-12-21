#!C:\Python27\python.exe -u
#!\usr\bin\env python

import cgitb
import cgi
import datetime
import MySQLdb
import json

cgitb.enable()

conn = MySQLdb.connect("localhost", "root", "mysql", "EulibDB")
cursor = conn.cursor()
print 'Content-Type: application/html'
print

table = 'User'

cursor.execute('SELECT * FROM ' + table)
row = cursor.fetchone()

print '''Database<br/>'''
while row is not None:
    print '''<p>''', row, '''</p>'''
    print "<br/>"
    row = cursor.fetchone()


conn.commit()
conn.close()
