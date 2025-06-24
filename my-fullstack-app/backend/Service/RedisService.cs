using StackExchange.Redis;
using System;
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

        internal Task<bool> StringSetAsync(string key, string value)
        {
            throw new NotImplementedException();
        }

        internal Task<string> StringGetAsync(string key)
        {
            throw new NotImplementedException();
        }

        internal Task<bool> KeyDeleteAsync(string key)
        {
            throw new NotImplementedException();
        }
    }
}
