namespace MyApi.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Path { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool Disabled { get; set; }

        public int GroupId { get; set; }
        public MenuGroup Group { get; set; } = null!;
    }
}
