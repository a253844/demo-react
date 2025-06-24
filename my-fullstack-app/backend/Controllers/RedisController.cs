using Microsoft.AspNetCore.Mvc;
using MyApi.Service;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedisController : ControllerBase
    {
        private readonly RedisService _redisService;

        public RedisController(RedisService redisService)
        {
            _redisService = redisService;
        }

        [HttpPost("set")]
        public async Task<IActionResult> Set([FromQuery] string key, [FromQuery] string value)
        {
            await _redisService.SetStringAsync(key, value);
            return Ok("Stored");
        }

        [HttpGet("get")]
        public async Task<IActionResult> Get([FromQuery] string key)
        {
            var value = await _redisService.GetStringAsync(key);
            return value != null ? Ok(value) : NotFound();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromQuery] string key)
        {
            var deleted = await _redisService.DeleteKeyAsync(key);
            return deleted ? Ok("Deleted") : NotFound();
        }
    }
}
