using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SystemController(AppDbContext context)
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

        [HttpPost("Login")]
        public IActionResult Login()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpGet("LoginOut")]
        public IActionResult LoginOut()
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

        [HttpGet("GetLog")]
        public IActionResult GetLog()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpPost("InsertLog")]
        public IActionResult InsertLog()
        {
            var users = new[]
            {
                new { Id = 1, Name = "Alice", Email = "alice@example.com", Country = "Taiwan" },
                new { Id = 2, Name = "Bob", Email = "bob@example.com", Country = "USA" },
                new { Id = 3, Name = "Charlie", Email = "charlie@example.com", Country = "Japan" }
            };

            return Ok(users);
        }

        [HttpGet("GetMenus")]
        public async Task<IActionResult> GetMenus()
        {
            var menuData = await _context.MenuGroups
            .Include(g => g.Menus)
            .OrderBy(g => g.SortOrder)
            .Select(g => new
            {
                groupId = g.Id,
                groupName = g.Name,
                groupIcon = g.Icon,
                menus = g.Menus.Select(m => new {
                    itemId = m.Id,
                    path = m.Path,
                    name = m.Name,
                    disabled = m.Disabled
                }).ToList()
            })
            .ToListAsync();

            return Ok(menuData);
        }

    }
}
