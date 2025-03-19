using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementApi;
using OfficeOpenXml;

namespace ProductManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // [HttpPost]
        // public async Task<ActionResult<Product>> PostProduct(Product product)
        // {
        //     _context.Products.Add(product);
        //     await _context.SaveChangesAsync();
        //     return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        // }

        [HttpPost]
[HttpPost]
    public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDto productDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            CategoryName = productDto.CategoryName,
            Price = productDto.Price,
            ProductCode = productDto.ProductCode,
            CreatedDate = DateTime.UtcNow
        };

        if (productDto.Image != null)
        {
            // Define the path to the images directory
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // Check if the directory exists, and create it if it doesn't
            if (!Directory.Exists(imagesPath))
            {
                Directory.CreateDirectory(imagesPath);
            }

            // Save the uploaded file
            var filePath = Path.Combine(imagesPath, productDto.Image.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productDto.Image.CopyToAsync(stream);
            }

            // Set the image URL for the product
            product.Image = $"/images/{productDto.Image.FileName}";
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }

[HttpPut("{id}")]
public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto productDto)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null)
    {
        return NotFound();
    }

    product.Name = productDto.Name;
    product.Description = productDto.Description;
    product.CategoryName = productDto.CategoryName;
    product.Price = productDto.Price;

    if (productDto.Image != null)
    {
        var filePath = Path.Combine("wwwroot/images", productDto.Image.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await productDto.Image.CopyToAsync(stream);
        }
        product.Image = $"/images/{productDto.Image.FileName}";
    }

    _context.Products.Update(product);
    await _context.SaveChangesAsync();

    return Ok(product);
}

[HttpPost("import")]
    public async Task<IActionResult> ImportProducts(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // Ensure the file is an Excel file
        if (Path.GetExtension(file.FileName).ToLower() != ".xlsx")
        {
            return BadRequest("Invalid file format. Only .xlsx files are allowed.");
        }

        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream);

            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;

                for (int row = 2; row <= rowCount; row++) // Start from row 2 (skip header)
                {
                    var product = new Product
                    {
                        Name = worksheet.Cells[row, 1].Text,
                        Description = worksheet.Cells[row, 2].Text,
                        CategoryName = worksheet.Cells[row, 3].Text,
                        Price = decimal.Parse(worksheet.Cells[row, 4].Text),
                        Image = worksheet.Cells[row, 5].Text,
                        ProductCode = GenerateProductCode(), 
                        CreatedDate = DateTime.UtcNow
                    };

                    _context.Products.Add(product);
                }

                await _context.SaveChangesAsync();
            }
        }

        return Ok("Products imported successfully.");
    }
 private string GenerateProductCode()
    {
        var now = DateTime.Now;
        var yearMonth = now.ToString("yyyyMM");
        var sequentialCode = (_context.Products.Count() + 1).ToString("D3");
        return $"{yearMonth}-{sequentialCode}";
    }
    }
}