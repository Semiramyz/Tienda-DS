import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { Producto } from '../../models/producto.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-venta-form',
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
  standalone: false
})
export class VentaFormComponent implements OnInit {
  ventaForm: FormGroup;
  isEditMode = false;
  ventaId: number | null = null;
  loading = false;
  error: string | null = null;
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  usuarios: Usuario[] = [];
  selectedProducto: Producto | null = null;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ventaForm = this.fb.group({
      Fecha: [new Date().toISOString().split('T')[0], Validators.required],
      IdUsuario: ['', Validators.required],
      IdCliente: ['', Validators.required],
      IdProducto: ['', Validators.required],
      Cantidad: [1, [Validators.required, Validators.min(1)]],
      TotalVenta: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
    this.loadUsuarios();
    
    this.ventaForm.get('IdProducto')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.ventaForm.get('Cantidad')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.ventaId = +id;
      this.loadVenta(this.ventaId);
    }
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
      }
    });
  }

  loadProductos(): void {
    this.productoService.getAll().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.filter(u => u.Rol === 'Vendedor' || u.Rol === 'Admin');
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  loadVenta(id: number): void {
    this.loading = true;
    this.ventaService.getById(id).subscribe({
      next: (venta) => {
        this.ventaForm.patchValue({
          Fecha: venta.Fecha ? new Date(venta.Fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          IdUsuario: venta.IdUsuario,
          IdCliente: venta.IdCliente,
          IdProducto: venta.IdProducto,
          Cantidad: venta.Cantidad,
          TotalVenta: venta.TotalVenta
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar venta';
        this.loading = false;
        console.error(err);
      }
    });
  }

  calculateTotal(): void {
    const productoId = this.ventaForm.get('IdProducto')?.value;
    const cantidad = this.ventaForm.get('Cantidad')?.value || 0;

    if (productoId && cantidad > 0) {
      this.selectedProducto = this.productos.find(p => p.IdProducto == productoId) || null;
      if (this.selectedProducto) {
        const total = this.selectedProducto.PrecioVenta * cantidad;
        this.ventaForm.get('TotalVenta')?.setValue(total.toFixed(2));
      }
    } else {
      this.ventaForm.get('TotalVenta')?.setValue(0);
    }
  }

  onSubmit(): void {
    if (this.ventaForm.invalid) {
      Object.keys(this.ventaForm.controls).forEach(key => {
        this.ventaForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const venta: Venta = {
      IdVenta: this.ventaId || 0,
      Fecha: new Date(this.ventaForm.value.Fecha),
      IdUsuario: this.ventaForm.value.IdUsuario ? +this.ventaForm.value.IdUsuario : undefined,
      IdCliente: this.ventaForm.value.IdCliente ? +this.ventaForm.value.IdCliente : undefined,
      IdProducto: this.ventaForm.value.IdProducto ? +this.ventaForm.value.IdProducto : undefined,
      Cantidad: +this.ventaForm.value.Cantidad,
      TotalVenta: +this.ventaForm.get('TotalVenta')?.value
    };

    const request = this.isEditMode
      ? this.ventaService.update(this.ventaId!, venta)
      : this.ventaService.create(venta);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/ventas']);
      },
      error: (err) => {
        this.error = this.isEditMode ? 'Error al actualizar venta' : 'Error al crear venta';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/ventas']);
  }
}
