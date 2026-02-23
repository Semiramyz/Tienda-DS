using System;
using System.Collections.Generic;

namespace Tienda_DS.Server.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string? NitCedula { get; set; }

    public int? IdUsuario { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }

    public virtual ICollection<Ventum> Venta { get; set; } = new List<Ventum>();
}
