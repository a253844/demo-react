using Microsoft.AspNetCore.Mvc;
using MyApi.Service;
using StackExchange.Redis;
using System.Threading.Tasks;

namespace MyApi.Helpers
{
    public class RedisHelpser
    {

        private readonly RedisService _redisService;

        public RedisHelpser(RedisService redisService)
        {
            _redisService = redisService;
        }

        public async Task<bool> SetStringAsync(string key, string value)
        {
            return await _redisService.StringSetAsync(key, value);
        }

        public async Task<string?> GetStringAsync(string key)
        {
            return await _redisService.StringGetAsync(key);
        }

        public async Task<bool> DeleteKeyAsync(string key)
        {
            return await _redisService.KeyDeleteAsync(key);
        }

        public async Task<IActionResult> TryGetStringResult(string key)
        {
            var value = await GetStringAsync(key);
            return value != null ? new OkObjectResult(value) : new NotFoundResult();
        }

        public async Task<IActionResult> TryDeleteKeyResult(string key)
        {
            var deleted = await DeleteKeyAsync(key);
            return deleted ? new OkObjectResult("Deleted") : new NotFoundResult();
        }

        public async Task<IActionResult> TrySetStringResult(string key, string value)
        {
            await SetStringAsync(key, value);
            return new OkObjectResult("Stored");
        }

    }
}
