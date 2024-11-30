var productListApiUrl = "http://localhost:5000/get_products";
var orderSaveApiUrl = "http://localhost:5000/insertOrder"
var productPrices = {};
var productList = []; 

$(document).ready(function() {
    $.get(productListApiUrl, function (response) {
        productList = response || [];
        productPrices = {}; 

        if (productList.length > 0) {
            var options = '<option value="">--Select Product--</option>';
            $.each(productList, function(index, product) {
                options += '<option value="'+ product.Product_id +'">'+ product.Name +'</option>';
                productPrices[product.Product_id] = product.price_per_unit; 
            });
            $(".product-box .product-select").empty().append(options); 
        }
    });

    $("#addMoreButton").click(function () {
        console.log("Add More button clicked");
        if (productList.length === 0) {
            alert("No products available to add.");
            return;
        }

        var newRow = $("#billTable tbody tr:first").clone(); 
        newRow.find('.product-price').val('0.0');
        newRow.find('.product-qty').val('1');
        newRow.find('.product-total').val('0.0');

        var options = '<option value="">--Select Product--</option>';
        $.each(productList, function(index, product) {
            options += '<option value="' + product.Product_id + '">' + product.Name + '</option>';
        });
        newRow.find('.product-select').empty().append(options);

        $("#billTable tbody").append(newRow);
        console.log("New row added");
        calculateTotal();
    });

    $(document).on("click", ".remove-row", function () {
        $(this).closest('tr').remove();
        calculateTotal();
    });
    
$(document).on("click", ".remove-row", function () {
    $(this).closest('.product-box-row').remove();
});

$(document).on('input', '.product-price, .product-qty', function() {
    calculateTotal();
});

    function calculateTotal() {
        let total = 0;
        $("#billTable tbody tr").each(function() {
            const price = parseFloat($(this).find('.product-price').val()) || 0;
            const quantity = parseFloat($(this).find('.product-qty').val()) || 1;
            const rowTotal = price * quantity; 
    
            $(this).find('.product-total').val(rowTotal.toFixed(2));
            total += rowTotal;
        });
        $("#total").text(total.toFixed(2));
    }

    
    $("#saveOrder").on("click", function () {
        var formData = $("form").serializeArray(); 
        var requestPayload = {
            customer_name: $("#customerName").val(),
            total: parseFloat($("#totalAmount").text()) || 0,
            order_details: []
        };

        $("#billTable tbody tr").each(function () {
            var product_id = $(this).find(".product-select").val();
            var quantity = parseInt($(this).find(".product-qty").val()) || 1;
            var total_price = parseFloat($(this).find(".product-total").val()) || 0;

            if (product_id) {
                requestPayload.order_details.push({
                    product_id: product_id,
                    quantity: quantity,
                    total_price: total_price
                });
            }
        });

        callApi("POST", orderSaveApiUrl, requestPayload);
    });

    
    function callApi(method, url, data) {
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                alert("Order saved successfully!");
                console.log(response);
            },
            error: function (xhr, status, error) {
                alert("An error occurred while saving the order.");
                console.log(error);
            }
        });
    }
});
