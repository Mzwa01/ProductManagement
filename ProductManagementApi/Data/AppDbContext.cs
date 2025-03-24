using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductManagementApi.Models;

namespace ProductManagementApi
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

             modelBuilder.Entity<Category>().HasData(
        new Category
        {
            CategoryId = 1,
            Name = "Electronics",
            CategoryCode = "ELE123",
            IsActive = true,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        },
        new Category
        {
            CategoryId = 2,
            Name = "Clothing",
            CategoryCode = "CLO456",
            IsActive = true,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        },
        new Category
        {
            CategoryId = 3,
            Name = "Books",
            CategoryCode = "BOK789",
            IsActive = false,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        }
    );

    // Seed Products
    modelBuilder.Entity<Product>().HasData(
        new Product
        {
            ProductId = 1,
            ProductCode = "202310-001",
            Name = "Smartphone",
            Description = "Latest smartphone with advanced features",
            CategoryName = "Electronics",
            Price = 699.99m,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        },
        new Product
        {
            ProductId = 2,
            ProductCode = "202310-002",
            Name = "Laptop",
            Description = "High-performance laptop for professionals",
            CategoryName = "Electronics",
            Price = 1299.99m,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        },
        new Product
        {
            ProductId = 3,
            ProductCode = "202310-003",
            Name = "T-Shirt",
            Description = "Comfortable cotton t-shirt",
            CategoryName = "Clothing",
            Price = 19.99m,
            CreatedDate = new DateTime(2023, 10, 1) // Static value
        }
    );
        }
    }
}