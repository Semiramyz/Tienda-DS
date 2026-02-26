import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { Proveedor } from '../../models/proveedor.model';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';

interface InventarioGroup {
  proveedor: string;
  productos: Producto[];
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: false
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  loading = false;
  error: string | null = null;
  showInventario = false;
  inventarioGroups: InventarioGroup[] = [];
  totalInventario = 0;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.proveedorService.getAll().subscribe({
      next: (data) => this.proveedores = data,
      error: () => {}
    });
  }

  loadProductos(): void {
    this.loading = true;
    this.error = null;
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.buildInventario();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleInventario(): void {
    this.showInventario = !this.showInventario;
    if (this.showInventario) {
      this.buildInventario();
    }
  }

  buildInventario(): void {
    const groups = new Map<string, Producto[]>();
    for (const p of this.productos) {
      const prov = this.proveedores.find(pr => pr.IdProveedor === p.IdProveedor);
      const name = prov ? prov.Empresa : 'Sin proveedor';
      if (!groups.has(name)) {
        groups.set(name, []);
      }
      groups.get(name)!.push(p);
    }
    this.inventarioGroups = Array.from(groups.entries()).map(([proveedor, productos]) => ({
      proveedor,
      productos
    }));
    this.totalInventario = this.productos.reduce((sum, p) => sum + (p.Stock || 0) * p.PrecioCompra, 0);
  }

  deleteProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          this.loadProductos();
        },
        error: (err) => {
          this.error = 'Error al eliminar producto';
          console.error(err);
        }
      });
    }
  }
}
