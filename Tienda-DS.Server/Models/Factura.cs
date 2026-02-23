using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Factura
{
    public int IdFactura { get; set; }

    public string? NroFactura { get; set; }

    public int? IdVenta { get; set; }

    public int? IdUsuario { get; set; }

    public DateOnly? FechaEmision { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }

    public virtual Ventum? IdVentaNavigation { get; set; }
}
