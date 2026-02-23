using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Ventum
{
    public int IdVenta { get; set; }

    public DateTime? Fecha { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdCliente { get; set; }

    public int? IdProducto { get; set; }

    public int Cantidad { get; set; }

    public decimal TotalVenta { get; set; }

    public virtual ICollection<Contabilidad> Contabilidads { get; set; } = new List<Contabilidad>();

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual Cliente? IdClienteNavigation { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
