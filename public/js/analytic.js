var analytic = {
    makeRequestStepOne:function (){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: false,
            url: "/analytic/make-request/mode/make-request-step-one/",
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    makeRequestStepTwo:function (){
        //return;
        window.dataLayer = window.dataLayer || [];
        console.log('step two');
        $.ajax({
            type: 'POST',
            async: false,
            url: "/analytic/make-request/mode/make-request-step-two/",
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    makeRequestStepThree:function (){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: false,
            url: "/analytic/make-request/mode/make-request-step-three/",
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    productClicks:function(product_id){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: false,
            url: "/analytic/products/mode/product-clicks/",
            data: {"product_id" : product_id},
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    productDetails:function(product_id){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: false,
            url: "/analytic/products/mode/product-details/",
            data: {"product_id" : product_id},
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    productAddCart:function(product_id){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: true,
            url: "/analytic/products/mode/product-add-cart/",
            data: {"product_id" : product_id},
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    productRemoveCart:function(product_id){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: true,
            url: "/analytic/products/mode/product-remove-cart/",
            data: {"product_id" : product_id},
            success: function(data){
                if(data.result['status']){
                    dataLayer.push(jQuery.parseJSON(data.result['value']));
                }
            }
        });
    },
    productImpression:function(products_id){
        //return;
        window.dataLayer = window.dataLayer || [];
        $.ajax({
            type: 'POST',
            async: true,
            url: "/analytic/products/mode/product-impression/",
            data: {"products_id" : products_id},
            success: function(data){
                if(data.result['status']){
                    if ( document.readyState === "complete" ) {
                        dataLayer.push(jQuery.parseJSON(data.result['value']));
                    }
                }
            }
        });
    },
    gtagFunc: function (products_id) {
        var promise =
        $.ajax({
            type: 'POST',
            async: true,
            url: "/analytic/gtag/mode/index/",
            data: {"products_id" : products_id}
        });

        return promise;
    },
    gtagConversion: function () {
        var promise =
        $.ajax({
            type: 'POST',
            async: true,
            url: "/analytic/gtag/mode/conversion/"
        });

        return promise;
    }

}
