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

conn = sqlite3.connect('register.db')
cursor = conn.cursor()

form = cgi.FieldStorage()



table = 'userinfo'

#print '''<p>something</p>'''
# for r in cursor.execute('SELECT * FROM ' + table +';'):
#     #print '''<p> this script has lost it completely </p>'''
#     print '''<p>''', r, '''</p>'''
#     print "<br/>"

data = {}

nameInInput = form['search_input'].value;
#print '''<p>''',nameInInput,'''</p>'''



#print '''<p>''',nameInInput,'''</p>



for i in cursor.execute("SELECT * FROM " + table + " WHERE name=?;",
    [nameInInput]):
    data['name'] = i[0]
    #print '''<p> but it's here?? ''', 'name' in data, '''</p>'''
    data['email'] = i[1]
    data['superpower'] = i[2]

#print '''<p>''', data['name'],'''</p>'''
#print '''<p>''', 'name' in data, '''</p>'''

print json.dumps(data)

#creating table
# cursor.execute('CREATE TABLE IF NOT EXISTS aTable (name text, email text, power text)')

#inserting stuff in the table
# cursor.execute('''INSERT INTO aTable VALUES(?,?,?)''' ,(form['name'].value,form['email'].value,form['powers'].value))
#
#
# name = form["name"].value
# email = form["email"].value
#
#
#
# print '''<html>
# <head>
# <title> loaded from print.py!</title>
# </head>
#
# <body>
# This is amazing!<br/>
# <p> Hi''', name,'''Your email is''',email,'''
# </br>
#
# You chose the power of''',form["powers"].value,'''
# </p>
#
#
# </body>
#
#
# <body>'''
conn.commit()

conn.close()
