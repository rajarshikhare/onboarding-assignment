
const base = "https://fake-ecommerce-app-api.onrender.com"

// Product Start
export const getProducts = (sort, maxPrice, minPrice, category, currentPage) => {
    return fetch(`${base}/products?limit=12&page=${currentPage}&category=${category.join(",")}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`)
        .then(res => res.json())
}

export const getProduct = id => {
    return fetch(`${base}/products/${id}`)
        .then(res => res.json())
}

// Product Ends

// Orders Start
export const getOrders = () => {
    fetch('https://fake-ecommerce-app-api.onrender.com/orders', {
        method: "POST",
        body: JSON.stringify(
            {
                "userId": "3",
                "products": [
                    {
                        "productId": 5,
                        "quantity": 1
                    },
                    {
                        "productId": 3,
                        "quantity": 1
                    }
                ],
                "paymentStatus": "PAID",
                "orderStatus": "CONFIRMED",
                "shippingAddress": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "addressLine1": "11, Somebuilding",
                    "addressLine2": "Landmark",
                    "city": "Mumbai",
                    "zipcode": "123123",
                    "contactNo": "123123123123"
                }
            }
        )
    })
        .then(res => res.json())
        .then(json => console.log(json))
    return fetch(`${base}/orders/user/3`)
        .then(res => res.json())
}

// Orders End