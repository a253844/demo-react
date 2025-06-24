using Microsoft.AspNetCore.Mvc;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
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
