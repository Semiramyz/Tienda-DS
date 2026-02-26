using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;
using Tienda_DS.Server.DTOs;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly TiendaSdContext _context;

        public VentasController(TiendaSdContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaDTO>>> GetVentas()
        {
            var ventas = await _context.Venta
                .Select(v => new VentaDTO
                {
                    IdVenta = v.IdVenta,
                    Fecha = v.Fecha,
                    IdUsuario = v.IdUsuario,
                    IdCliente = v.IdCliente,
                    IdProducto = v.IdProducto,
                    Cantidad = v.Cantidad,
                    TotalVenta = v.TotalVenta
                })
                .ToListAsync();

            return ventas;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VentaDTO>> GetVenta(int id)
        {
            var venta = await _context.Venta.FindAsync(id);

            if (venta == null)
            {
                return NotFound();
            }

            return new VentaDTO
            {
                IdVenta = venta.IdVenta,
                Fecha = venta.Fecha,
                IdUsuario = venta.IdUsuario,
                IdCliente = venta.IdCliente,
                IdProducto = venta.IdProducto,
                Cantidad = venta.Cantidad,
                TotalVenta = venta.TotalVenta
            };
        }

        [HttpPost]
        public async Task<ActionResult<VentaDTO>> PostVenta(VentaDTO ventaDto)
        {
            var venta = new Ventum
            {
                Fecha = ventaDto.Fecha,
                IdUsuario = ventaDto.IdUsuario,
                IdCliente = ventaDto.IdCliente,
                IdProducto = ventaDto.IdProducto,
                Cantidad = ventaDto.Cantidad,
                TotalVenta = ventaDto.TotalVenta
            };

            _context.Venta.Add(venta);
            await _context.SaveChangesAsync();

            ventaDto.IdVenta = venta.IdVenta;

            return CreatedAtAction(nameof(GetVenta), new { id = venta.IdVenta }, ventaDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVenta(int id, VentaDTO ventaDto)
        {
            if (id != ventaDto.IdVenta)
            {
                return BadRequest();
            }

            var venta = await _context.Venta.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }

            venta.Fecha = ventaDto.Fecha;
            venta.IdUsuario = ventaDto.IdUsuario;
            venta.IdCliente = ventaDto.IdCliente;
            venta.IdProducto = ventaDto.IdProducto;
            venta.Cantidad = ventaDto.Cantidad;
            venta.TotalVenta = ventaDto.TotalVenta;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaExists(id))
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
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Venta.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }

            _context.Venta.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VentaExists(int id)
        {
            return _context.Venta.Any(e => e.IdVenta == id);
        }
    }
}
