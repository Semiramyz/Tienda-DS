export interface Contabilidad {
  idRegistro: number;
  tipo: string;
  monto: number;
  descripcion?: string;
  fechaContable?: Date;
  idVenta?: number;
  idProveedor?: number;
}
