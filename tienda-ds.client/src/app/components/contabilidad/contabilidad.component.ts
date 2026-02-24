import { Component, OnInit } from '@angular/core';
import { Contabilidad } from '../../models/contabilidad.model';
import { ContabilidadService } from '../../services/contabilidad.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css'],
  standalone: false
})
export class ContabilidadComponent implements OnInit {
  registros: Contabilidad[] = [];
  loading = false;
  error: string | null = null;

  constructor(private contabilidadService: ContabilidadService) {}

  ngOnInit(): void {
    this.loadRegistros();
  }

  loadRegistros(): void {
    this.loading = true;
    this.error = null;
    this.contabilidadService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar registros contables';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteRegistro(id: number): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.contabilidadService.delete(id).subscribe({
        next: () => {
          this.loadRegistros();
        },
        error: (err) => {
          this.error = 'Error al eliminar registro';
          console.error(err);
        }
      });
    }
  }
}
