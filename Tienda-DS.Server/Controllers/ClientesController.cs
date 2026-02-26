using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tienda_DS.Server.Models;
using Tienda_DS.Server.DTOs;

namespace Tienda_DS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly TiendaSdContext _context;

        public ClientesController(TiendaSdContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDTO>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Select(c => new ClienteDTO
                {
                    IdCliente = c.IdCliente,
                    Nombre = c.Nombre,
                    NitCedula = c.NitCedula,
                    IdUsuario = c.IdUsuario
                })
                .ToListAsync();

            return clientes;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDTO>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return new ClienteDTO
            {
                IdCliente = cliente.IdCliente,
                Nombre = cliente.Nombre,
                NitCedula = cliente.NitCedula,
                IdUsuario = cliente.IdUsuario
            };
        }

        [HttpPost]
        public async Task<ActionResult<ClienteDTO>> PostCliente(ClienteDTO clienteDto)
        {
            var cliente = new Cliente
            {
                Nombre = clienteDto.Nombre,
                NitCedula = clienteDto.NitCedula,
                IdUsuario = clienteDto.IdUsuario
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            clienteDto.IdCliente = cliente.IdCliente;

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.IdCliente }, clienteDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, ClienteDTO clienteDto)
        {
            if (id != clienteDto.IdCliente)
            {
                return BadRequest();
            }

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            cliente.Nombre = clienteDto.Nombre;
            cliente.NitCedula = clienteDto.NitCedula;
            cliente.IdUsuario = clienteDto.IdUsuario;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.IdCliente == id);
        }
    }
}
