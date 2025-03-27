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
    public class CategoriesControllerTests
    {
        private Mock<ICategoryRepository> _mockRepo;
        private CategoriesController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockRepo = new Mock<ICategoryRepository>();
            _controller = new CategoriesController(_mockRepo.Object);
        }

        [TestMethod]
        public async Task GetCategories_ReturnsOkResult_WithListOfCategories()
        {
            // Arrange
            var categories = new List<Category> { new Category { CategoryId = 1, Name = "Test Category" } };
            _mockRepo.Setup(repo => repo.GetCategoriesAsync()).ReturnsAsync(categories);

            // Act
            var result = await _controller.GetCategories();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnCategories = okResult.Value as List<Category>;
            Assert.IsNotNull(returnCategories);
            Assert.AreEqual(1, returnCategories.Count);
        }

        [TestMethod]
        public async Task CreateCategory_ReturnsCreatedAtActionResult_WithCreatedCategory()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "New Category" };
            _mockRepo.Setup(repo => repo.AddCategoryAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateCategory(category);

            // Assert
            var createdAtActionResult = result as CreatedAtActionResult;
            Assert.IsNotNull(createdAtActionResult);
            var returnCategory = createdAtActionResult.Value as Category;
            Assert.IsNotNull(returnCategory);
            Assert.AreEqual(category.Name, returnCategory.Name);
        }

        [TestMethod]
        public async Task UpdateCategory_ReturnsNoContentResult()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "Updated Category"};
            _mockRepo.Setup(repo => repo.GetCategoryByIdAsync(1)).ReturnsAsync(category);
            _mockRepo.Setup(repo => repo.UpdateCategoryAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateCategory(1, category);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        [TestMethod]
        public async Task DeleteCategory_ReturnsNoContentResult_WhenCategoryExists()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "Test Category" };
            _mockRepo.Setup(repo => repo.GetCategoryByIdAsync(1)).ReturnsAsync(category);
            _mockRepo.Setup(repo => repo.DeleteCategoryAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteCategory(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        [TestMethod]
        public async Task DeleteCategory_ReturnsNotFoundResult_WhenCategoryDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetCategoryByIdAsync(1)).ReturnsAsync((Category)null);

            // Act
            var result = await _controller.DeleteCategory(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}
