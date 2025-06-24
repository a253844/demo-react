using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new[] { "Sunny", "Cloudy", "Rainy" };
    }
}
