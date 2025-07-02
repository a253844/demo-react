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


    }
}
