using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly RedisService _redis;
        private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");


        public SystemController(AppDbContext context, IWebHostEnvironment env, RedisService redis)
        {
            _context = context;
            _env = env;
            _redis = redis;
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin,Manager,User")]
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
                menus = g.Menus
                .OrderBy(g => g.SortOrder)
                .Select(m => new {
                    itemId = m.Id,
                    path = m.Path,
                    name = m.Name,
                    isEnabled = m.IsEnabled
                }).ToList()
            })
            .ToListAsync();

            return Ok(menuData);
        }

        [Authorize(Roles = "Admin,Manager,User")]
        [HttpGet("GetDataType")]
        public async Task<IActionResult> GetDataType()
        {
            var menuData = await _context.DataTypeGroups
            .Include(g => g.DataTypes)
            .Select(g => new
            {
                groupId = g.Id,
                groupName = g.Name,
                isEnabled = g.IsEnabled,
                dataTypes = g.DataTypes.Select(m => new {
                    itemId = m.Id,
                    number = m.Number,
                    name = m.Name,
                    isEnabled = m.IsEnabled
                }).ToList()
            })
            .ToListAsync();

            return Ok(menuData);
        }

        [HttpGet("FileList")]
        public IActionResult GetFileListWithDetail()
        {
            if (!Directory.Exists(_uploadPath))
                return Ok(new List<object>());

            var files = Directory.GetFiles(_uploadPath)
                .Select(filePath =>
                {
                    var info = new FileInfo(filePath);
                    return new
                    {
                        FileName = info.Name,
                        Size = info.Length, // bytes
                        CreatedAt = info.CreationTime
                    };
                })
                .ToList();

            return Ok(files);
        }

        [HttpPost("UploadFile")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            var fileNo = DateTime.Now.ToString("yyyyMMddHHmmss_") + file.FileName;

            var filePath = Path.Combine(_uploadPath, fileNo);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            await _redis.SetStringAsync(@"upload:"+DateTime.Now.ToString("yyyy:MM:dd"), fileNo);
            
            return Ok(new { FileName = fileNo, Size = file.Length });
        }

        [HttpGet("DownloadFile")]
        public IActionResult DownloadFile([FromQuery] string filename)
        {
            if (string.IsNullOrEmpty(filename))
                return BadRequest("Filename is required.");

            var filePath = Path.Combine(_uploadPath, filename);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = GetContentType(filePath);

            return File(fileBytes, contentType, filename);
        }

        private string GetContentType(string path)
        {
            var types = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase)
        {
            { ".txt", "text/plain" },
            { ".pdf", "application/pdf" },
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".doc", "application/msword" },
            { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        };

            var ext = Path.GetExtension(path);
            return types.TryGetValue(ext, out string contentType) ? contentType : "application/octet-stream";
        }

        [HttpDelete("DeleteFile")]
        public IActionResult DeleteFile([FromQuery] string filename)
        {
            if (string.IsNullOrWhiteSpace(filename))
                return BadRequest("檔案名稱不得為空");

            var filePath = Path.Combine(_uploadPath, filename);

            if (!System.IO.File.Exists(filePath))
                return NotFound("找不到指定的檔案");

            try
            {
                System.IO.File.Delete(filePath);
                return Ok("檔案已刪除");
            }
            catch (Exception ex)
            {
                // 實務上可記錄 log
                return StatusCode(500, $"刪除失敗: {ex.Message}");
            }
        }
    }
}
