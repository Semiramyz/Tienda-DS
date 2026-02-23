using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContabilidadController : ControllerBase
    {
        private readonly TiendaSdContext _context;

        public ContabilidadController(TiendaSdContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contabilidad>>> GetContabilidad()
        {
            return await _context.Contabilidads
                .Include(c => c.IdVentaNavigation)
                .Include(c => c.IdProveedorNavigation)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contabilidad>> GetContabilidadById(int id)
        {
            var contabilidad = await _context.Contabilidads
                .Include(c => c.IdVentaNavigation)
                .Include(c => c.IdProveedorNavigation)
                .FirstOrDefaultAsync(c => c.IdRegistro == id);

            if (contabilidad == null)
            {
                return NotFound();
            }

            return contabilidad;
        }

        [HttpPost]
        public async Task<ActionResult<Contabilidad>> PostContabilidad(Contabilidad contabilidad)
        {
            _context.Contabilidads.Add(contabilidad);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContabilidadById), new { id = contabilidad.IdRegistro }, contabilidad);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutContabilidad(int id, Contabilidad contabilidad)
        {
            if (id != contabilidad.IdRegistro)
            {
                return BadRequest();
            }

            _context.Entry(contabilidad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContabilidadExists(id))
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
        public async Task<IActionResult> DeleteContabilidad(int id)
        {
            var contabilidad = await _context.Contabilidads.FindAsync(id);
            if (contabilidad == null)
            {
                return NotFound();
            }

            _context.Contabilidads.Remove(contabilidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContabilidadExists(int id)
        {
            return _context.Contabilidads.Any(e => e.IdRegistro == id);
        }
    }
}
