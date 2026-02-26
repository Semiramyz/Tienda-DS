import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Producto } from '../../models/producto.model';
import { Proveedor } from '../../models/proveedor.model';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
  standalone: false
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEditMode = false;
  productoId: number | null = null;
  loading = false;
  error: string | null = null;
  proveedores: Proveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      NombreProd: ['', [Validators.required, Validators.minLength(3)]],
      PrecioVenta: ['', [Validators.required, Validators.min(0)]],
      PrecioCompra: ['', [Validators.required, Validators.min(0)]],
      Stock: [0, [Validators.min(0)]],
      IdProveedor: ['']
    });
  }

  ngOnInit(): void {
    this.loadProveedores();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productoId = +id;
      this.loadProducto(this.productoId);
    }
  }

  loadProveedores(): void {
    this.proveedorService.getAll().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
      }
    });
  }

  loadProducto(id: number): void {
    this.loading = true;
    this.productoService.getById(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          NombreProd: producto.NombreProd,
          PrecioVenta: producto.PrecioVenta,
          PrecioCompra: producto.PrecioCompra,
          Stock: producto.Stock,
          IdProveedor: producto.IdProveedor
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar producto';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const producto: Producto = {
      IdProducto: this.productoId || 0,
      NombreProd: this.productoForm.value.NombreProd,
      PrecioVenta: +this.productoForm.value.PrecioVenta,
      PrecioCompra: +this.productoForm.value.PrecioCompra,
      Stock: this.productoForm.value.Stock ? +this.productoForm.value.Stock : 0,
      IdProveedor: this.productoForm.value.IdProveedor ? +this.productoForm.value.IdProveedor : undefined
    };

    const request = this.isEditMode
      ? this.productoService.update(this.productoId!, producto)
      : this.productoService.create(producto);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.error = this.isEditMode ? 'Error al actualizar producto' : 'Error al crear producto';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
  }
}
