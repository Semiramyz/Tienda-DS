export interface Contabilidad {
  IdRegistro: number;
  Tipo: string;
  Monto: number;
  Descripcion?: string;
  FechaContable?: Date;
  IdVenta?: number;
  IdProveedor?: number;
}
