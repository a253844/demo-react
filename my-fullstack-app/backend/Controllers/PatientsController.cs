using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyApi.Data;
using MyApi.Models;
using System;
using System.Linq;
using System.Xml.Linq;
using static MyApi.Helpers.Enums;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] int id)
        {
            var Patients = _context.Patients
                .Where(p => p.Id == id && p.IsDelete == false)
                .ToList();

            if (Patients.Count == 0)
            {
                return BadRequest("未找到病患資料");
            }

            return Ok(Patients);
        }

        [HttpGet("GetList")]
        public IActionResult GetList([FromQuery] string name, DateTime? starttime, DateTime? endtime)
        {
            var Patients = _context.Patients
                .Where(p =>  p.IsDelete == false)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            if (!string.IsNullOrEmpty(name))
            {
                Patients = Patients.Where(p => p.FullName.Contains(name)).ToList();
            }

            if (starttime!= null && endtime != null)
            {
                Patients = Patients.Where(p => p.CreatedAt >= starttime && p.CreatedAt <= endtime).ToList();
            }

            return Ok(Patients);
        }

        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] Patient data)
        {
            try
            {
                var userId = User.FindFirst("UserId");

                var Patients = _context.Patients
                .Where(p => p.FullName == data.FullName && p.IsDelete == false)
                .ToList();

                if (Patients.Count > 0)
                {
                    return BadRequest("已有相同病患姓名");
                }

                data.OptionUserId = int.Parse(userId.Value);
                data.UpdatedAt = DateTime.Now;

                _context.Patients.Add(data);
                _context.SaveChanges();

                return Ok("病患資料已新增");
            }catch(Exception ex)
            {
                return StatusCode(500, $"新增失敗: {ex.Message}");
            }
            
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody] Patient data)
        {
            var userId = User.FindFirst("UserId");

            var Patients = _context.Patients
                .Where(p => p.Id == data.Id && p.IsDelete == false)
                .ToList();

            if (Patients.Count == 0)
            {
                return BadRequest("未找到病患資料");
            }

            Patients.First().FullName = data.FullName;
            Patients.First().Gender = data.Gender;
            Patients.First().Phone = data.Phone;
            Patients.First().Address = data.Address;
            Patients.First().BirthDate = data.BirthDate;
            Patients.First().EmergencyContact = data.EmergencyContact;
            Patients.First().EmergencyRelationship = data.EmergencyRelationship;
            Patients.First().EmergencyPhone = data.EmergencyPhone;
            Patients.First().NationalId = data.NationalId;
            Patients.First().MedicalHistory = data.MedicalHistory;
            Patients.First().ExerciseHabit = data.ExerciseHabit;
            Patients.First().ExerciseFrequency = data.ExerciseFrequency;
            Patients.First().InjuryHistory = data.InjuryHistory;
            Patients.First().UpdatedAt = DateTime.Now;
            Patients.First().OptionUserId = int.Parse(userId.Value);

            _context.SaveChanges();

            return Ok("病患資料已更新");
        }

        [Authorize(Roles = "Admin,Manager,User")]
        [HttpGet("Delete")]
        public IActionResult Delete([FromQuery] string id)
        {
            var userId = User.FindFirst("UserId");

            var Patients = _context.Patients
                .Where(p => p.Id.ToString() == id && p.IsDelete == false)
                .ToList();

            if (Patients.Count == 0)
            {
                return BadRequest("未找到病患資料");
            }

            Patients.First().IsDelete = true;
            Patients.First().OptionUserId = int.Parse(userId.Value);
            Patients.First().UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok("病患資料已刪除");
        }
    }
}
