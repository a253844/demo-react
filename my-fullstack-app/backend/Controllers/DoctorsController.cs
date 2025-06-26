using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using static MyApi.Helpers.Enums;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult Get()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpGet]
        [HttpGet("GetList")]
        public IActionResult GetList([FromQuery] string UserName, int RoleId)
        {
            var Users = _context.UserRoles
                .Include(t => t.User)
                .Include(t => t.Role)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            if(!string.IsNullOrEmpty(UserName))
            {
                Users = Users.Where(t => t.User.Name == UserName).ToList();
            }

            if (RoleId != 0)
            {
                Users = Users.Where(t => t.RoleId == RoleId).ToList();
            }

            var result = Users.Select(t => new
            {
                UserId = t.User.Id,
                UserName = t.User.Name,
                RoleId = t.RoleId,
                RoleName = t.Role.Name,
            }).ToList();

            return Ok(result);
        }

        [HttpPost("Insert")]
        public IActionResult Insert()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpPost("Update")]
        public IActionResult Update()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpPost("Delete")]
        public IActionResult Delete()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpGet("GetTreatmentList")]
        public IActionResult GetTreatmentList([FromQuery] string patientname, string? nationalId, int? doctortid, TreatmentStep? step, DateTime? starttime, DateTime? endtime)
        {

            var treatments = new List<Treatment>();

            treatments = _context.Treatments
                .Include(t => t.User)
                .Include(t => t.Patient)
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

            if (step != null )
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
                OrdreNo = t.OrdreNo,
                Step = t.Step,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                OptionUserId = t.OptionUserId
            }).ToList();

            return Ok(result);
        }

        [HttpPost("InsertTreatment")]
        public IActionResult InsertTreatment([FromBody] Treatment data)
        {
            try
            {
                var userId = User.FindFirst("UserId");

                var treatments = _context.Treatments
                .Where(p => p.PatientId == data.PatientId)
                .ToList();

                if (treatments.Count > 0)
                {
                    if(treatments.First().Step != TreatmentStep.CaseClose)
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

                return Ok("治療案件已新增");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"新增失敗: {ex.Message}");
            }

        }

        [HttpPut("Update")]
        public IActionResult UpdateTreatment([FromBody] Treatment data)
        {
            var userId = User.FindFirst("UserId");

            var treatment = _context.Treatments
                .Where(t => t.OrdreNo == data.OrdreNo && t.IsDelete == false)
                .FirstOrDefault();

            if (treatment == null)
            {
                return BadRequest("未找到案件資料");
            }

            if (treatment.Step == TreatmentStep.CaseClose)
            {
                return BadRequest("此治療案件已結案");
            }

            // 更新欄位
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
                .Where(t => t.Step != TreatmentStep.CaseClose && t.Patient.NationalId == nationalId)
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
