using Microsoft.AspNetCore.Mvc;

namespace MyApi.Controllers
{
    public class TreatmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
