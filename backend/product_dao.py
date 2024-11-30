from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor() 
    query = ("SELECT products.Product_id, products.Name , products.uom_id, products.price_per_unit, uom.uom_name FROM products inner join uom on products.uom_id=uom.uom_id")
    cursor.execute(query)

    response = [] 

    for (Product_id, Name, uom_id, price_per_unit,uom_name) in cursor:
         response.append(
        {'Product_id': Product_id,
         'Name':Name ,
         'uom_id':uom_id,
         'price_per_unit':price_per_unit,
         'uom_name':uom_name }


    )
    return response

def insert_new_product(connection,products):
    cursor = connection.cursor()
    query = ("INSERT INTO products (Name, uom_id, price_per_unit, quantity) VALUES (%s, %s, %s, %s)")
    data = (products['Name'],products['uom_id'],products['price_per_unit'],products['quantity'])
    cursor.execute(query,data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection, Product_id):
    cursor = connection.cursor()
    qurey = ("DELETE FROM products where Product_id="+str(Product_id))
    cursor.execute(qurey)
    connection.commit()


if __name__ == '__main__':
    connection = get_sql_connection(1)
    print(delete_product(connection,12))