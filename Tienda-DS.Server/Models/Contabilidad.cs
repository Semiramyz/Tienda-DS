using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Contabilidad
{
    public int IdRegistro { get; set; }

    public string Tipo { get; set; } = null!;

    public decimal Monto { get; set; }

    public string? Descripcion { get; set; }

    public DateTime? FechaContable { get; set; }

    public int? IdVenta { get; set; }

    public int? IdProveedor { get; set; }

    public virtual Proveedor? IdProveedorNavigation { get; set; }

    public virtual Ventum? IdVentaNavigation { get; set; }
}
