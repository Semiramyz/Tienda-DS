using Microsoft.AspNetCore.Mvc;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<object> GetHealth()
        {
            _logger.LogInformation("Health check requested");
            return Ok(new
            {
                status = "OK",
                message = "Backend is running",
                timestamp = DateTime.UtcNow
            });
        }

        [HttpGet("ping")]
        public ActionResult<string> Ping()
        {
            _logger.LogInformation("Ping requested");
            return Ok("pong");
        }
    }
}
