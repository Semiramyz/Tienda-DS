import { Component, OnInit } from '@angular/core';
import { Factura } from '../../models/factura.model';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  facturas: Factura[] = [];
  loading = false;
  error: string | null = null;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas(): void {
    this.loading = true;
    this.error = null;
    this.facturaService.getAll().subscribe({
      next: (data) => {
        this.facturas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar facturas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteFactura(id: number): void {
    if (confirm('¿Está seguro de eliminar esta factura?')) {
      this.facturaService.delete(id).subscribe({
        next: () => {
          this.loadFacturas();
        },
        error: (err) => {
          this.error = 'Error al eliminar factura';
          console.error(err);
        }
      });
    }
  }
}
