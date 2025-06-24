using System;
using System.Collections.Generic;

namespace MyApi.Models
{
    public class MenuGroup
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public string Icon { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsEnabled { get; set; } = true;
        public int OptionUserId { get; set; }

        public List<Menu> Menus { get; set; } = new();
    }
}
