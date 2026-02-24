import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  standalone: false
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  loading = false;
  error: string | null = null;

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading = true;
    this.error = null;
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar proveedores';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteProveedor(id: number): void {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      this.proveedorService.delete(id).subscribe({
        next: () => {
          this.loadProveedores();
        },
        error: (err) => {
          this.error = 'Error al eliminar proveedor';
          console.error(err);
        }
      });
    }
  }
}
