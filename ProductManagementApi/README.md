# Product Management API

## Overview

The Product Management API is a RESTful service for managing products and categories. It supports CRUD operations for products and categories, as well as importing products from an Excel file.

## Technologies Used

- ASP.NET Core
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger
- Moq (for unit testing)
- MSTest (for unit testing)
- NUnit (for unit testing)

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQL Server
- Visual Studio or VS Code

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/product-management-api.git
    cd product-management-api
    ```

2. Update the connection string in `appsettings.json`:
    ```json
    "ConnectionStrings": {
        "DefaultConnection": "Server=your_server;Database=ProductManagementDb;User Id=your_user;Password=your_password;"
    }
    ```

3. Apply migrations and create the database:
    ```sh
    dotnet ef database update
    ```

4. Run the application:
    ```sh
    dotnet run
    ```

### API Endpoints

#### Products

- `GET /api/products`: Get all products
- `POST /api/products`: Create a new product
- `PUT /api/products/{id}`: Update an existing product
- `DELETE /api/products/{id}`: Delete a product
- `POST /api/products/import`: Import products from an Excel file

#### Categories

- `GET /api/categories`: Get all categories
- `GET /api/categories/{id}`: Get a category by ID
- `POST /api/categories`: Create a new category
- `PUT /api/categories/{id}`: Update an existing category
- `DELETE /api/categories/{id}`: Delete a category

## Unit Testing

Unit tests are written using MSTest, NUnit, and Moq. To run the tests, use the following command:
```sh
dotnet test
```

## License

This project is licensed under the MIT License.
