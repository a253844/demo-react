using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Models;
using static MyApi.Helpers.Enums;
using System.Collections.Generic;
using System;
using MyApi.Data;
using System.Linq;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TreatmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TreatmentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetList")]
        public IActionResult GetList([FromQuery] string patientname, string? nationalId, int? doctortid, TreatmentStep? step, DateTime? starttime, DateTime? endtime)
        {

            var treatments = new List<Treatment>();

            treatments = _context.Treatments
                .Include(t => t.User)
                .Include(t => t.Patient)
                .Where(t => t.IsDelete == false)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            if (!string.IsNullOrEmpty(patientname))
            {
                treatments = treatments.Where(p => p.Patient.FullName.Contains(patientname))
                .ToList();
            }

            if (!string.IsNullOrEmpty(nationalId))
            {
                treatments = treatments.Where(p => p.Patient.NationalId == nationalId).ToList();
            }

            if (doctortid != null)
            {
                treatments = treatments.Where(p => p.UserId == doctortid).ToList();
            }

            if (step != null)
            {
                treatments = treatments.Where(p => p.Step == step).ToList();
            }

            if (starttime != null && endtime != null)
            {
                treatments = treatments.Where(p => p.CreatedAt >= starttime && p.CreatedAt <= endtime).ToList();
            }

            var result = treatments.Select(t => new
            {
                DoctorId = t.User.Id,
                DoctorName = t.User.Name,

                PatientId = t.Patient.Id,
                NationalId = t.Patient.NationalId,
                PatientName = t.Patient.FullName,
                PatientGender = t.Patient.Gender,
                Id = t.Id,
                OrdreNo = t.OrdreNo,
                Step = t.Step,
                FrontAndBack = t.FrontAndBack,
                DiscomfortArea = t.DiscomfortArea,
                DiscomfortSituation = t.DiscomfortSituation,
                DiscomfortPeriod = t.DiscomfortPeriod,
                DiscomfortDegree = t.DiscomfortDegree,
                PossibleCauses = t.PossibleCauses,
                TreatmentHistory = t.TreatmentHistory,
                HowToKnowOur = t.HowToKnowOur,
                HospitalFormUrl = t.HospitalFormUrl,
                TreatmentConsentFormUrl = t.TreatmentConsentFormUrl,
                Subjective = t.Subjective,
                Objective = t.Objective,
                Assessment = t.Assessment,
                Plan = t.Plan,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                IsDelete = t.IsDelete,
                OptionUserId = t.OptionUserId,
            }).ToList();

            return Ok(result);
        }

        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] Treatment data)
        {
            try
            {
                var userId = User.FindFirst("UserId");

                var treatments = _context.Treatments
                .Where(p => p.PatientId == data.PatientId && p.IsDelete == false)
                .ToList();

                if (treatments.Count > 0)
                {
                    if (treatments.First().Step != TreatmentStep.CaseClose && 
                        treatments.First().Step != TreatmentStep.CreateReceipt)
                    {
                        return BadRequest("此病患尚未結束療程");
                    }

                }

                data.OrdreNo = DateTime.Now.ToString("yyyyMMddhhmmss");
                data.OptionUserId = int.Parse(userId.Value);
                data.Step = TreatmentStep.Opencase;
                data.UserId = int.Parse(userId.Value);
                data.UpdatedAt = DateTime.Now;

                _context.Treatments.Add(data);
                _context.SaveChanges();

                var result = new
                {
                    Msg = "治療案件已新增",
                    OrdreNo = data.OrdreNo
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"新增失敗: {ex.Message}");
            }
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody] Treatment data)
        {
            var userId = User.FindFirst("UserId");

            var treatment = _context.Treatments
                .Where(t => t.OrdreNo == data.OrdreNo && t.IsDelete == false)
                .FirstOrDefault();

            if (treatment == null)
            {
                return BadRequest("未找到案件資料");
            }

            if (treatment.Step == TreatmentStep.CaseClose || 
                treatment.Step == TreatmentStep.CreateReceipt)
            {
                return BadRequest("此治療案件已結案");
            }

            // 更新欄位
            treatment.FrontAndBack = data.FrontAndBack;
            treatment.DiscomfortArea = data.DiscomfortArea;
            treatment.DiscomfortSituation = data.DiscomfortSituation;
            treatment.DiscomfortPeriod = data.DiscomfortPeriod;
            treatment.DiscomfortDegree = data.DiscomfortDegree;
            treatment.PossibleCauses = data.PossibleCauses;
            treatment.TreatmentHistory = data.TreatmentHistory;
            treatment.HowToKnowOur = data.HowToKnowOur;
            treatment.HospitalFormUrl = data.HospitalFormUrl;
            treatment.TreatmentConsentFormUrl = data.TreatmentConsentFormUrl;
            treatment.Subjective = data.Subjective;
            treatment.Objective = data.Objective;
            treatment.Assessment = data.Assessment;
            treatment.Plan = data.Plan;
            treatment.Step = data.Step;
            treatment.Subjective = data.Subjective;
            treatment.Objective = data.Objective;
            treatment.Assessment = data.Assessment;
            treatment.Plan = data.Plan;
            treatment.UpdatedAt = DateTime.Now;
            treatment.OptionUserId = int.Parse(userId.Value);

            _context.SaveChanges();

            return Ok("治療案件已更新");
        }

        [Authorize(Roles = "Admin,Manager,User")]
        [HttpGet("Delete")]
        public IActionResult Delete([FromQuery] string OrdreNo)
        {
            var userId = User.FindFirst("UserId");

            var treatment = _context.Treatments
                .Where(p => p.OrdreNo == OrdreNo && p.IsDelete == false)
                .ToList();

            if (treatment.Count == 0)
            {
                return BadRequest("未找到案件資料");
            }

            treatment.First().IsDelete = true;
            treatment.First().OptionUserId = int.Parse(userId.Value);
            treatment.First().UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok("治療案件已刪除");
        }

        [HttpGet("GetCaseStatus")]
        public IActionResult GetCaseStatus([FromQuery] string nationalId)
        {
            var treatments = new List<Treatment>();

            treatments = _context.Treatments
                .Include(t => t.User)
                .Include(t => t.Patient)
                .Where(t => t.Step != TreatmentStep.CaseClose &&
                            t.Step != TreatmentStep.CreateReceipt &&
                            t.Patient.NationalId == nationalId && 
                            t.IsDelete == false)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            if (treatments.Count > 0)
            {
                return BadRequest("治療案件尚未結束");
            }

            return Ok();
        }
    }
}
