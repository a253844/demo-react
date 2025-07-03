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

#region MySQL �s�u

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
              .AllowAnyMethod()
              .AllowCredentials(); //SignalR 
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

#region JWT ���ҪA��

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

#region SignalR �A��

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

#region �Ϥ��w��

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

#endregion

#region ���e�T��

app.MapHub<ReportHub>("/reportHub");

#endregion

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // �۰ʫإ߸�Ʈw
}

app.MapControllers();
app.Run();
