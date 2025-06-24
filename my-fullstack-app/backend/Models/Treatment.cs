using System;
using static MyApi.Helpers.Enums;

namespace MyApi.Models
{
    public class Treatment
    {
        public int Id { get; set; }
        public string OrdreNo { get; set; }
        public TreatmentStep Step { get; set; }
        public string FrontAndBack { get; set; }
        public string DiscomfortArea { get; set; }
        public string DiscomfortSituation { get; set; }
        public string DiscomfortPeriod { get; set; }
        public string PossibleCauses { get; set; }
        public string TreatmentHistory { get; set; }
        public string HowToKnowOur { get; set; }
        public string HospitalFormUrl { get; set; }
        public string TreatmentConsentFormUrl { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public Boolean IsDelete { get; set; } = false;
        public int OptionUserId { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

    }
}
