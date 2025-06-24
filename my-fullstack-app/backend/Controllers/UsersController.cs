using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetUsers")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        [HttpPost("ResetPassWord")]
        public IActionResult ResetPassWord(string UserId)
        {
            var user = _context.Users.SingleOrDefault(u => u.Id.ToString() == UserId);

            if(user == null)
            {
                return Unauthorized("用戶不存在");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456");
            _context.SaveChanges();

            return Ok();
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

        [HttpGet("doctors")]
        public IActionResult Doctors()
        {
            var doctors = new[]
            {
                new { id = 5, firstname = "周", lastname = "OO", username = "1111" },
                new { id = 6, firstname = "吳", lastname = "OO", username = "1112" },
                new { id = 7, firstname = "許", lastname = "OO", username = "1113" },
                new { id = 8, firstname = "林", lastname = "OO", username = "1114" },
                new { id = 5, firstname = "周", lastname = "OO", username = "1111" },
                new { id = 6, firstname = "吳", lastname = "OO", username = "1112" },
                new { id = 7, firstname = "許", lastname = "OO", username = "1113" },
                new { id = 8, firstname = "林", lastname = "OO", username = "1114" },
                new { id = 5, firstname = "周", lastname = "OO", username = "1111" },
                new { id = 6, firstname = "吳", lastname = "OO", username = "1112" },
                new { id = 7, firstname = "許", lastname = "OO", username = "1113" },
                new { id = 8, firstname = "林", lastname = "OO", username = "1114" },
                new { id = 5, firstname = "周", lastname = "OO", username = "1111" },
                new { id = 6, firstname = "吳", lastname = "OO", username = "1112" },
                new { id = 7, firstname = "許", lastname = "OO", username = "1113" },
                new { id = 8, firstname = "林", lastname = "OO", username = "1114" },
            };

            return Ok(doctors);
        }

    }

}
