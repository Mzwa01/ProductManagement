namespace ProductManagementApi.Models;
public class Product
{
    public int? ProductId { get; set; }
    public string ProductCode { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string CategoryName { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? Image { get; set; }
}