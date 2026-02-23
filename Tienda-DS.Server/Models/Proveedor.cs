using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Proveedor
{
    public int IdProveedor { get; set; }

    public string Empresa { get; set; } = null!;

    public string? Contacto { get; set; }

    public int? IdUsuario { get; set; }

    public virtual ICollection<Contabilidad> Contabilidads { get; set; } = new List<Contabilidad>();

    public virtual Usuario? IdUsuarioNavigation { get; set; }

    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
