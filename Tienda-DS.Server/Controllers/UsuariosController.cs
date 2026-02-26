using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;
using Tienda_DS.Server.DTOs;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly TiendaSdContext _context;
        private readonly ILogger<UsuariosController> _logger;

        public UsuariosController(TiendaSdContext context, ILogger<UsuariosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            _logger.LogInformation("GET /api/usuarios - Fetching all users");
            try
            {
                var usuarios = await _context.Usuarios
                    .Select(u => new UsuarioDTO
                    {
                        IdUsuario = u.IdUsuario,
                        NombreUsuario = u.NombreUsuario,
                        Password = "", // No enviar password en GET
                        Rol = u.Rol
                    })
                    .ToListAsync();

                _logger.LogInformation($"GET /api/usuarios - Returned {usuarios.Count} users");
                return usuarios;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(int id)
        {
            _logger.LogInformation($"GET /api/usuarios/{id}");
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);

                if (usuario == null)
                {
                    _logger.LogWarning($"Usuario {id} not found");
                    return NotFound();
                }

                return new UsuarioDTO
                {
                    IdUsuario = usuario.IdUsuario,
                    NombreUsuario = usuario.NombreUsuario,
                    Password = "", // No enviar password en GET
                    Rol = usuario.Rol
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching user {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> PostUsuario(UsuarioDTO usuarioDto)
        {
            _logger.LogInformation("POST /api/usuarios - Creating new user");
            try
            {
                // Validar que el rol sea válido
                var rolesValidos = new[] { "admin", "vendedor", "proveedor", "comprador" };
                if (!rolesValidos.Contains(usuarioDto.Rol?.ToLower()))
                {
                    return BadRequest(new { message = $"Rol inválido '{usuarioDto.Rol}'. Roles válidos: {string.Join(", ", rolesValidos)}" });
                }

                var usuario = new Usuario
                {
                    NombreUsuario = usuarioDto.NombreUsuario,
                    Password = usuarioDto.Password,
                    Rol = usuarioDto.Rol
                };

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User created with ID: {usuario.IdUsuario}");

                usuarioDto.IdUsuario = usuario.IdUsuario;
                usuarioDto.Password = "";

                return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, usuarioDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { message = "Error al crear usuario", detail = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, UsuarioDTO usuarioDto)
        {
            _logger.LogInformation($"PUT /api/usuarios/{id}");

            if (id != usuarioDto.IdUsuario)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            var rolesValidos = new[] { "admin", "vendedor", "proveedor", "comprador" };
            if (!rolesValidos.Contains(usuarioDto.Rol?.ToLower()))
            {
                return BadRequest(new { message = $"Rol inválido '{usuarioDto.Rol}'. Roles válidos: {string.Join(", ", rolesValidos)}" });
            }

            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return NotFound(new { message = $"Usuario {id} no encontrado" });
                }

                usuario.NombreUsuario = usuarioDto.NombreUsuario;
                usuario.Rol = usuarioDto.Rol;

                if (!string.IsNullOrEmpty(usuarioDto.Password))
                {
                    usuario.Password = usuarioDto.Password;
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"User {id} updated successfully");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {id}");
                return StatusCode(500, new { message = "Error al actualizar usuario", detail = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            _logger.LogInformation($"DELETE /api/usuarios/{id}");
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return NotFound(new { message = $"Usuario {id} no encontrado" });
                }

                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"User {id} deleted successfully");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting user {id}");
                return StatusCode(500, new { message = "Error al eliminar usuario", detail = ex.InnerException?.Message ?? ex.Message });
            }
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
