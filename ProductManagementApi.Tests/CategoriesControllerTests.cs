using Microsoft.AspNetCore.Mvc;
using Moq;
using ProductManagementApi.Controllers;
using ProductManagementApi;
using ProductManagementApi.Repositories;
using Xunit;

namespace ProductManagementApi.Tests
{
    public class CategoriesControllerTests
    {
        private readonly Mock<ICategoryRepository> _mockRepo;
        private readonly CategoriesController _controller;

        public CategoriesControllerTests()
        {
            _mockRepo = new Mock<ICategoryRepository>();
            _controller = new CategoriesController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetCategories_ReturnsOkResult_WithListOfCategories()
        {
            // Arrange
            var categories = new List<Category> { new Category { CategoryId = 1, Name = "Test Category" } };
            _mockRepo.Setup(repo => repo.GetCategoriesAsync()).ReturnsAsync(categories);

            // Act
            var result = await _controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnCategories = Assert.IsType<List<Category>>(okResult.Value);
            Assert.Single(returnCategories);
        }

        [Fact]
        public async Task CreateCategory_ReturnsCreatedAtActionResult_WithCreatedCategory()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "New Category", Description = "Description" };
            _mockRepo.Setup(repo => repo.AddCategoryAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateCategory(category);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnCategory = Assert.IsType<Category>(createdAtActionResult.Value);
            Assert.Equal(category.Name, returnCategory.Name);
        }

        [Fact]
        public async Task UpdateCategory_ReturnsNoContentResult()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "Updated Category", Description = "Updated Description" };
            _mockRepo.Setup(repo => repo.GetCategoryByIdAsync(1)).ReturnsAsync(category);
            _mockRepo.Setup(repo => repo.UpdateCategoryAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateCategory(1, category);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsNoContentResult()
        {
            // Arrange
            var category = new Category { CategoryId = 1, Name = "Test Category" };
            _mockRepo.Setup(repo => repo.GetCategoryByIdAsync(1)).ReturnsAsync(category);
            _mockRepo.Setup(repo => repo.DeleteCategoryAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteCategory(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
