import mysql.connector

__cnx = None
def get_sql_connection(connection):
  global __cnx
  if __cnx is None:
      __cnx = mysql.connector.connect(user='root',password='Ethical9567',
                             host='127.0.0.1',
                             database='gs')
  return __cnx 