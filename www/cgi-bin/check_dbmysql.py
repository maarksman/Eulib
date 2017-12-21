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

form = cgi.FieldStorage()

username_client = form['username'].value
email_client = form['email'].value



password_client = form['password'].value
time = str(datetime.datetime.now())
data = {}
password_hashed = hashlib.md5()
password_hashed.update(password_client)
password_hashed.update(time)
password_hashed=password_hashed.hexdigest()

#Empty table if you wanna
#cursor.execute('DROP TABLE IF EXISTS userinfo')

#creating table
cursor.execute('CREATE TABLE IF NOT EXISTS user (username text, password text, registration_date date, first_name text, last_name text, time_stamp TIMESTAMP)')

cursor.execute('''SELECT email FROM User WHERE email = %s''',(email_client,))
row = cursor.fetchone()

#inserting stuff in the table
if row is None:
    cursor.execute(''' INSERT INTO User (username, email, password, currenttime) VALUES(%s,%s,%s,%s)''' ,(username_client,email_client,password_hashed,time))
    print"created account"
else:
    print"email already exists. please try a different email."

#IF [NOT] EXISTS (SELECT 1 FROM userinfo WHERE email = email_client)


conn.commit()
conn.close()
