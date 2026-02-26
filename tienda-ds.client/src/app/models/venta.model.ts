export interface Venta {
  IdVenta: number;
  Fecha?: Date;
  IdUsuario?: number;
  IdCliente?: number;
  IdProducto?: number;
  Cantidad: number;
  TotalVenta: number;
}
