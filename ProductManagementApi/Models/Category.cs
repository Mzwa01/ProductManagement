namespace ProductManagementApi.Models;
public class Category
{
    public int? CategoryId { get; set; }
    public string Name { get; set; }
    public string CategoryCode { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
}