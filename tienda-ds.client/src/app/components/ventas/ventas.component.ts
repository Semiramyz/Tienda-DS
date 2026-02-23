import { Component, OnInit } from '@angular/core';
import { Venta } from '../../models/venta.model';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  loading = false;
  error: string | null = null;

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.loading = true;
    this.error = null;
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ventas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteVenta(id: number): void {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      this.ventaService.delete(id).subscribe({
        next: () => {
          this.loadVentas();
        },
        error: (err) => {
          this.error = 'Error al eliminar venta';
          console.error(err);
        }
      });
    }
  }
}
