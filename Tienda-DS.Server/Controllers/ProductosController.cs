using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;
using Tienda_DS.Server.DTOs;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly TiendaSdContext _context;

        public ProductosController(TiendaSdContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDTO>>> GetProductos()
        {
            var productos = await _context.Productos
                .Select(p => new ProductoDTO
                {
                    IdProducto = p.IdProducto,
                    NombreProd = p.NombreProd,
                    PrecioVenta = p.PrecioVenta,
                    PrecioCompra = p.PrecioCompra,
                    Stock = p.Stock,
                    IdProveedor = p.IdProveedor
                })
                .ToListAsync();

            return productos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDTO>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return new ProductoDTO
            {
                IdProducto = producto.IdProducto,
                NombreProd = producto.NombreProd,
                PrecioVenta = producto.PrecioVenta,
                PrecioCompra = producto.PrecioCompra,
                Stock = producto.Stock,
                IdProveedor = producto.IdProveedor
            };
        }

        [HttpPost]
        public async Task<ActionResult<ProductoDTO>> PostProducto(ProductoDTO productoDto)
        {
            var producto = new Producto
            {
                NombreProd = productoDto.NombreProd,
                PrecioVenta = productoDto.PrecioVenta,
                PrecioCompra = productoDto.PrecioCompra,
                Stock = productoDto.Stock,
                IdProveedor = productoDto.IdProveedor
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            productoDto.IdProducto = producto.IdProducto;

            return CreatedAtAction(nameof(GetProducto), new { id = producto.IdProducto }, productoDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, ProductoDTO productoDto)
        {
            if (id != productoDto.IdProducto)
            {
                return BadRequest();
            }

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.NombreProd = productoDto.NombreProd;
            producto.PrecioVenta = productoDto.PrecioVenta;
            producto.PrecioCompra = productoDto.PrecioCompra;
            producto.Stock = productoDto.Stock;
            producto.IdProveedor = productoDto.IdProveedor;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
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
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.IdProducto == id);
        }
    }
}
