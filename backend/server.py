from flask import Flask , request , jsonify
from flask import json
from flask_cors import CORS  
import product_dao 
from product_dao import insert_new_product 
import uom_dao
import order_dao
from order_dao import insert_order
from  sql_connection import get_sql_connection

app  = Flask(__name__)
CORS(app)

connection = get_sql_connection(1)

@app.route('/get_products' , methods=['GET'])
def get_products():
    products = product_dao.get_all_products(connection)
    product_dao.get_all_products(connection)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response 

@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = uom_dao.get_uoms(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertProduct', methods=['POST'])
def insert_product():
    try:
        request_payload = request.get_json()
        Name = request_payload['Name']
        uom_id = request_payload['uom_id']
        price_per_unit = request_payload['price_per_unit']
        quantity = request_payload['quantity']
        insert_new_product(connection, request_payload)

        return 'Product inserted successfully!', 200
    except Exception as e:
        return f'Error: {str(e)}', 500



@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    response = order_dao.get_all_orders(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertOrder', methods=['POST'])
def insert_order_route():
    try:
        order = request.get_json()
        if not all(key in order for key in ['customer_name', 'total', 'order_details']):
            return jsonify({"error": "Missing required fields"}), 400
        order_id = insert_order(connection, order)
        return jsonify({"message": "Order successfully inserted!", "order_id": order_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    try:
        request_payload = request.get_json()
        Product_id = request_payload['Product_id']

        return_id = product_dao.delete_product(connection, Product_id)
        response = jsonify({
        'Product_id': return_id
    })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    print("Starting Python FLask Server for Pedia Kanak Grocery Store Management Sysytem")
    app.run(port=5000)