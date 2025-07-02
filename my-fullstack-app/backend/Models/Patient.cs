using System;
using System.Collections.Generic;
using static MyApi.Helpers.Enums;

namespace MyApi.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public Gender Gender { get; set; } 
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime? BirthDate { get; set; }
        public string EmergencyContact { get; set; }
        public string EmergencyRelationship { get; set; }
        public string EmergencyPhone  { get; set; }
        public string NationalId { get; set; }
        public string MedicalHistory { get; set; }
        public string ExerciseHabit { get; set; }
        public string ExerciseFrequency { get; set; }
        public string InjuryHistory { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public Boolean IsDelete { get; set; } = false;
        public int OptionUserId { get; set; }

        public List<Treatment> Treatments { get; set; } = new();
        public List<Receipt> Receipts { get; set; } = new();
    }
}
