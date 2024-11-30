var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';

var productsApiUrl = 'https://fakestoreapi.com/products';

function callApi(method, url, data, successCallback) {
    $.ajax({
        method: method,
        url: url,
        contentType: 'application/json',  
        data: JSON.stringify(data),
        success: successCallback,
    }).done(function( msg ) {
        window.location.reload();
    })}


document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

   
    var Name = document.getElementById('product-name').value;
    var price_per_unit = document.getElementById('product-price').value;
    var quantity = document.getElementById('product-quantity').value;
    var uom_id = document.getElementById('product-uom-id').value;

    
    var products = {
        Name: Name,
        price_per_unit: parseFloat(price_per_unit),
        quantity: parseInt(quantity),
        uom_id: parseInt(uom_id)
    };

    
    callApi('POST', productSaveApiUrl, products, function(response) {
        if (response.Product_id) {
            alert('Product added successfully! Product ID: ' + response.Product_id);
            document.getElementById('add-product-form').reset();
        } else {
            alert('Error adding product. Please try again.');
        }
    });
});