using StackExchange.Redis;
using System.Threading.Tasks;

namespace MyApi.Service
{
    public class RedisService
    {

        private readonly IDatabase _database;

        public RedisService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task SetStringAsync(string key, string value)
        {
            await _database.StringSetAsync(key, value);
        }

        public async Task<string?> GetStringAsync(string key)
        {
            return await _database.StringGetAsync(key);
        }

        public async Task<bool> DeleteKeyAsync(string key)
        {
            return await _database.KeyDeleteAsync(key);
        }

    }
}
