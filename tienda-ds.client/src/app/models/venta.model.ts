export interface Venta {
  idVenta: number;
  fecha?: Date;
  idUsuario?: number;
  idCliente?: number;
  idProducto?: number;
  cantidad: number;
  totalVenta: number;
}
