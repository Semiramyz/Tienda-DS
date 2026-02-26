export interface Producto {
  IdProducto: number;
  NombreProd: string;
  PrecioVenta: number;
  PrecioCompra: number;
  Stock?: number;
  IdProveedor?: number;
}
