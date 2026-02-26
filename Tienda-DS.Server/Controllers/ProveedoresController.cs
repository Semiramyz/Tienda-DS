using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;
using Tienda_DS.Server.DTOs;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly TiendaSdContext _context;

        public ProveedoresController(TiendaSdContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDTO>>> GetProveedores()
        {
            var proveedores = await _context.Proveedors
                .Select(p => new ProveedorDTO
                {
                    IdProveedor = p.IdProveedor,
                    Empresa = p.Empresa,
                    Contacto = p.Contacto,
                    IdUsuario = p.IdUsuario
                })
                .ToListAsync();

            return proveedores;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDTO>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedors.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            return new ProveedorDTO
            {
                IdProveedor = proveedor.IdProveedor,
                Empresa = proveedor.Empresa,
                Contacto = proveedor.Contacto,
                IdUsuario = proveedor.IdUsuario
            };
        }

        [HttpPost]
        public async Task<ActionResult<ProveedorDTO>> PostProveedor(ProveedorDTO proveedorDto)
        {
            var proveedor = new Proveedor
            {
                Empresa = proveedorDto.Empresa,
                Contacto = proveedorDto.Contacto,
                IdUsuario = proveedorDto.IdUsuario
            };

            _context.Proveedors.Add(proveedor);
            await _context.SaveChangesAsync();

            proveedorDto.IdProveedor = proveedor.IdProveedor;

            return CreatedAtAction(nameof(GetProveedor), new { id = proveedor.IdProveedor }, proveedorDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProveedor(int id, ProveedorDTO proveedorDto)
        {
            if (id != proveedorDto.IdProveedor)
            {
                return BadRequest();
            }

            var proveedor = await _context.Proveedors.FindAsync(id);
            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.Empresa = proveedorDto.Empresa;
            proveedor.Contacto = proveedorDto.Contacto;
            proveedor.IdUsuario = proveedorDto.IdUsuario;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProveedorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            var proveedor = await _context.Proveedors.FindAsync(id);
            if (proveedor == null)
            {
                return NotFound();
            }

            _context.Proveedors.Remove(proveedor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProveedorExists(int id)
        {
            return _context.Proveedors.Any(e => e.IdProveedor == id);
        }
    }
}
