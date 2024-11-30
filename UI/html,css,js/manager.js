var productListApiUrl = "http://localhost:5000/get_products";
var productSaveApiUrl = "http://localhost:5000/insertProduct";
var productDeleteApiUrl = "http://localhost:5000/deleteProduct";
var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var uomListApiUrl = "http://localhost:5000/getUOM";
var productModal = $("#productModal");
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, products) {
                    table += '<tr data-id="'+ products.Product_id +'" data-name="'+ products.Name +'" data-unit="'+ products.uom_id +'" data-price="'+ products.price_per_unit +'">' +
                        '<td>'+ products.Name +'</td>'+
                        '<td>'+ products.uom_name +'</td>'+
                        '<td>'+ products.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("#inventory-table tbody").html(table);
            }
        }).fail(function() {
            console.error("Error fetching product data.");
        });
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

    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            Product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +"?" );
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data, function(response) {
                if (response.Product_id) {
                    alert('Product deleted successfully! Product ID: ' + response.Product_id);
                    tr.remove();  
                } else {
                    alert('Error deleting product. Please try again.');
                }
            });
        }
    });
    
    
    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });
    $(function() {
        $.get(orderListApiUrl, function(response) {
            console.log("Order list loaded", response);
            if (response && Array.isArray(response)) {
                let tableRows = '';
                let totalCost = 0;
                $.each(response, function(index, orders) {
                    if (orders && orders.datetime && orders.order_id && orders.customer_name && orders.total) {
                        totalCost += orders.total;
                        totalCost += orders.total;
                        tableRows += '<tr>' +
                        '<td>' + orders.datetime + '</td>' +      
                        '<td>' + orders.order_id + '</td>' +      
                        '<td>' + orders.customer_name + '</td>' + 
                        '<td>' + orders.total.toFixed(2) + ' Rs</td>' + '</tr>';
                    }
                });
                $("#orderTable tbody").html(tableRows);
                $("#total-cost").text(totalCost.toFixed(2) + ' Rs');
            } else {
                console.error("Invalid API response.");
            }
        }).fail(function() {
            console.error("Error fetching order data.");
        });
    });