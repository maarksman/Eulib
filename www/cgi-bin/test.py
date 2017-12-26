import datetime
import hashlib

time = str(datetime.datetime.now(None))

print "time:" + time

password = "hardpass"

hashed_pass = hashlib.md5()
hashed_pass.update(time)
hashed_pass.update(password)
hashed_pass = hashed_pass.hexdigest()

print str(hashed_pass)