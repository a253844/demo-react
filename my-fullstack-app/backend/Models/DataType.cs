using System;

namespace MyApi.Models
{
    public class DataType
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsEnabled { get; set; } = true;
        public int OptionUserId { get; set; }

        public int DataTypeGroupId { get; set; }
        public DataTypeGroup DataTypeGroup { get; set; } = null!;
    }
}
