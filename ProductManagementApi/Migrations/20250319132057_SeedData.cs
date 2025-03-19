﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProductManagementApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryCode", "CreatedDate", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "ELE123", new DateTime(2025, 3, 19, 13, 20, 56, 496, DateTimeKind.Utc).AddTicks(3550), true, "Electronics" },
                    { 2, "CLO456", new DateTime(2025, 3, 19, 13, 20, 56, 496, DateTimeKind.Utc).AddTicks(4350), true, "Clothing" },
                    { 3, "BOK789", new DateTime(2025, 3, 19, 13, 20, 56, 496, DateTimeKind.Utc).AddTicks(4350), false, "Books" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "CategoryName", "CreatedDate", "Description", "Name", "Price", "ProductCode" },
                values: new object[,]
                {
                    { 1, "Electronics", new DateTime(2025, 3, 19, 13, 20, 56, 498, DateTimeKind.Utc).AddTicks(5120), "Latest smartphone with advanced features", "Smartphone", 699.99m, "202310-001" },
                    { 2, "Electronics", new DateTime(2025, 3, 19, 13, 20, 56, 498, DateTimeKind.Utc).AddTicks(6000), "High-performance laptop for professionals", "Laptop", 1299.99m, "202310-002" },
                    { 3, "Clothing", new DateTime(2025, 3, 19, 13, 20, 56, 498, DateTimeKind.Utc).AddTicks(6000), "Comfortable cotton t-shirt", "T-Shirt", 19.99m, "202310-003" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3);
        }
    }
}
