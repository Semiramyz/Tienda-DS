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
                    TotalVenta = v.TotalVenta,
                    NombreVendedor = v.IdUsuarioNavigation != null ? v.IdUsuarioNavigation.NombreUsuario : null,
                    NombreCliente = v.IdClienteNavigation != null ? v.IdClienteNavigation.Nombre : null,
                    NombreProducto = v.IdProductoNavigation != null ? v.IdProductoNavigation.NombreProd : null
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
            try
            {
                // Validar stock si hay producto
                if (ventaDto.IdProducto.HasValue)
                {
                    var producto = await _context.Productos.FindAsync(ventaDto.IdProducto.Value);
                    if (producto == null)
                        return BadRequest(new { message = "Producto no encontrado" });
                    if ((producto.Stock ?? 0) < ventaDto.Cantidad)
                        return BadRequest(new { message = $"Stock insuficiente. Disponible: {producto.Stock}" });

                    producto.Stock = (producto.Stock ?? 0) - ventaDto.Cantidad;
                }

                var venta = new Ventum
                {
                    Fecha = ventaDto.Fecha ?? DateTime.Now,
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear venta", detail = ex.InnerException?.Message ?? ex.Message });
            }
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
