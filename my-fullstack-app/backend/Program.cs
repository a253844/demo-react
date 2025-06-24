using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Microsoft.Extensions.Configuration;
using System;
using MyApi.Service;
using MyApi.Data;

var builder = WebApplication.CreateBuilder(args);

#region MySQL �s�u

// Add MySQL

var connectionDBName = "DefaultConnection";
var connectionRedisName = "Redis";
connectionDBName = "DebugConnection";
connectionRedisName = "DebugRedis";

var connectionString = builder.Configuration.GetConnectionString(connectionDBName);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

#endregion

#region Redis �s�u

// �[�J Redis �s�u
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration.GetConnectionString(connectionRedisName);
    return ConnectionMultiplexer.Connect(configuration);
});

// �[�J RedisService �@�� DI
builder.Services.AddSingleton<RedisService>();

#endregion

#region ���\��ӷ�

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3308", "http://127.0.0.1:3308", "http://localhost:3309", "http://127.0.0.1:3309") // React dev server 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

var app = builder.Build();
app.UseCors("AllowAll");
app.UseRouting();
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // �۰ʫإ߸�Ʈw
}

app.MapControllers();
app.Run();
