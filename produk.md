# Product

## /list
 - GET: Get all product
 - Header: 
    - Authorization: Bearer {token}
 - Response:
```json
    {
        "status": "success",
        "data": [
            {
                "id": 1,
                "name": "Product 1",
                "price": 10000,
                "stock": 10,
                "createdAt": "2021-01-01T00:00:00.000Z",
                "updatedAt": "2021-01-01T00:00:00.000Z"
            },
            {
                "id": 2,
                "name": "Product 2",
                "price": 20000,
                "stock": 20,
                "createdAt": "2021-01-01T00:00:00.000Z",
                "updatedAt": "2021-01-01T00:00:00.000Z"
            }
        ]
    }
```
