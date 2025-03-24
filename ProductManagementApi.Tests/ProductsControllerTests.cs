using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ProductManagementApi.Controllers;
using ProductManagementApi.Models;
using ProductManagementApi.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductManagementApi.Tests
{
    [TestClass]
    public class ProductsControllerTests
    {
        private Mock<IProductRepository> _mockRepo;
        private ProductsController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockRepo = new Mock<IProductRepository>();
            _controller = new ProductsController(_mockRepo.Object);
        }

        [TestMethod]
        public async Task GetProducts_ReturnsOkResult_WithListOfProducts()
        {
            // Arrange
            var products = new List<Product> { new Product { ProductId = 1, Name = "Test Product" } };
            _mockRepo.Setup(repo => repo.GetProductsAsync()).ReturnsAsync(products);

            // Act
            var result = await _controller.GetProducts();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnProducts = okResult.Value as List<Product>;
            Assert.IsNotNull(returnProducts);
            Assert.AreEqual(1, returnProducts.Count);
        }

        [TestMethod]
        public async Task CreateProduct_ReturnsOkResult_WithCreatedProduct()
        {
            // Arrange
            var productDto = new ProductCreateDto { Name = "New Product", Description = "Description", CategoryName = "Category", Price = 10.0M, ProductCode = "202301-001" };
            var product = new Product { ProductId = 1, Name = "New Product", Description = "Description", CategoryName = "Category", Price = 10.0M, ProductCode = "202301-001" };
            _mockRepo.Setup(repo => repo.AddProductAsync(It.IsAny<Product>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateProduct(productDto);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnProduct = okResult.Value as Product;
            Assert.IsNotNull(returnProduct);
            Assert.AreEqual(productDto.Name, returnProduct.Name);
        }

        [TestMethod]
        public async Task UpdateProduct_ReturnsOkResult_WithUpdatedProduct()
        {
            // Arrange
            var productDto = new ProductUpdateDto { Name = "Updated Product", Description = "Updated Description", CategoryName = "Updated Category", Price = 20.0M };
            var product = new Product { ProductId = 1, Name = "Original Product", Description = "Original Description", CategoryName = "Original Category", Price = 10.0M };
            _mockRepo.Setup(repo => repo.GetProductByIdAsync(1)).ReturnsAsync(product);
            _mockRepo.Setup(repo => repo.UpdateProductAsync(It.IsAny<Product>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateProduct(1, productDto);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnProduct = okResult.Value as Product;
            Assert.IsNotNull(returnProduct);
            Assert.AreEqual(productDto.Name, returnProduct.Name);
        }
    }
}
