export interface Producto {
  idProducto: number;
  nombreProd: string;
  precioVenta: number;
  precioCompra: number;
  stock?: number;
  idProveedor?: number;
}
