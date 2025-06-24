using System;
using System.Collections.Generic;

namespace MyApi.Models
{
    public class DataTypeGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsEnabled { get; set; } = true;
        public int OptionUserId { get; set; }

        public List<DataType> DataTypes { get; set; } = new();
    }
}
