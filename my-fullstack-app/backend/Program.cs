using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Microsoft.Extensions.Configuration;
using System;
using MyApi.Service;
using MyApi.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using System.IO;
using MyApi.Helpers;

var builder = WebApplication.CreateBuilder(args);

var connectionDBName = "DefaultConnection";
var connectionRedisName = "Redis";

var DebugMode = builder.Configuration["WebSitSettings:DebugMode"];
if (DebugMode == "true")
{
    connectionDBName = "DebugConnection";
    connectionRedisName = "DebugRedis";
}

#region MySQL 連線

var connectionString = builder.Configuration.GetConnectionString(connectionDBName);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

#endregion

#region Redis 連線

// 加入 Redis 連線
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration.GetConnectionString(connectionRedisName);
    return ConnectionMultiplexer.Connect(configuration);
});

// 加入 RedisService 作為 DI
builder.Services.AddSingleton<RedisService>();

#endregion

#region 允許跨來源

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3308", "http://127.0.0.1:3308", "http://localhost:3309", "http://127.0.0.1:3309") // React dev server 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); //SignalR 
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

#region JWT 驗證服務

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

#endregion

#region SignalR 服務

builder.Services.AddSignalR();

#endregion

var app = builder.Build();
app.UseCors("AllowAll");
app.UseRouting();
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();

#region 圖片預覽

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

#endregion

#region 推送訊息

app.MapHub<ReportHub>("/reportHub");

#endregion

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // 自動建立資料庫
}

app.MapControllers();
app.Run();
