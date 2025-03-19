
using Microsoft.AspNetCore.Http;

namespace ProductManagementApi
{
    public class ProductUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }
    }
}