using System;

namespace MyApi.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Path { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsEnabled { get; set; } = true;
        public int OptionUserId { get; set; }

        public int GroupId { get; set; }
        public MenuGroup Group { get; set; } = null!;
    }
}
