using System;

namespace MyApi.Models
{
    public class Receipt
    {
        public int Id { get; set; }
        public string OrdreNo { get; set; }
        public string TreatmentItem { get; set; }
        public double TreatmentMoney { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public Boolean IsDelete { get; set; } = false;
        public int OptionUserId { get; set; }

        public int TreatmentId { get; set; }
        public Treatment Treatment { get; set; } = null!;
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;
    }
}
