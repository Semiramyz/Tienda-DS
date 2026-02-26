namespace Tienda_DS.Server.DTOs
{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Rol { get; set; } = null!;
    }

    public class ClienteDTO
    {
        public int IdCliente { get; set; }
        public string Nombre { get; set; } = null!;
        public string? NitCedula { get; set; }
        public int? IdUsuario { get; set; }
    }

    public class ProveedorDTO
    {
        public int IdProveedor { get; set; }
        public string Empresa { get; set; } = null!;
        public string? Contacto { get; set; }
        public int? IdUsuario { get; set; }
    }

    public class ProductoDTO
    {
        public int IdProducto { get; set; }
        public string NombreProd { get; set; } = null!;
        public decimal PrecioVenta { get; set; }
        public decimal PrecioCompra { get; set; }
        public int? Stock { get; set; }
        public int? IdProveedor { get; set; }
    }

    public class VentaDTO
    {
        public int IdVenta { get; set; }
        public DateTime? Fecha { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdCliente { get; set; }
        public int? IdProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal TotalVenta { get; set; }
        public string? NombreVendedor { get; set; }
        public string? NombreCliente { get; set; }
        public string? NombreProducto { get; set; }
    }
}
