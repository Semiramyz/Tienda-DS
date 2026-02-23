using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Producto
{
    public int IdProducto { get; set; }

    public string NombreProd { get; set; } = null!;

    public decimal PrecioVenta { get; set; }

    public decimal PrecioCompra { get; set; }

    public int? Stock { get; set; }

    public int? IdProveedor { get; set; }

    public virtual Proveedor? IdProveedorNavigation { get; set; }

    public virtual ICollection<Ventum> Venta { get; set; } = new List<Ventum>();
}
