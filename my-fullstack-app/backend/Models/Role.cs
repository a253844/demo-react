using System;
using System.Collections.Generic;

namespace MyApi.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsEnabled { get; set; } = true;
        public int OptionUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public List<UserRole> UserRoles { get; set; } = new();
    }
}
