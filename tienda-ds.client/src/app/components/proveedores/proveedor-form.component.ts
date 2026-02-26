import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';
import { Proveedor } from '../../models/proveedor.model';
import { Producto } from '../../models/producto.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css'],
  standalone: false
})
export class ProveedorFormComponent implements OnInit {
  proveedorForm: FormGroup;
  isEditMode = false;
  proveedorId: number | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.proveedorForm = this.fb.group({
      Empresa: ['', [Validators.required, Validators.minLength(3)]],
      Contacto: [''],
      IdUsuario: [''],
      productos: this.fb.array([])
    });
  }

  get productosArray(): FormArray {
    return this.proveedorForm.get('productos') as FormArray;
  }

  ngOnInit(): void {
    this.loadUsuarios();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.proveedorId = +id;
      this.loadProveedor(this.proveedorId);
    } else {
      this.addProducto();
    }
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.filter(u => u.Rol === 'proveedor');
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  loadProveedor(id: number): void {
    this.proveedorService.getById(id).subscribe({
      next: (proveedor) => {
        this.proveedorForm.patchValue({
          Empresa: proveedor.Empresa,
          Contacto: proveedor.Contacto,
          IdUsuario: proveedor.IdUsuario
        });
      },
      error: (err) => {
        this.error = 'Error al cargar proveedor';
        console.error(err);
      }
    });
  }

  addProducto(): void {
    this.productosArray.push(this.fb.group({
      NombreProd: ['', Validators.required],
      PrecioCompra: ['', [Validators.required, Validators.min(0)]],
      PrecioVenta: ['', [Validators.required, Validators.min(0)]],
      Stock: [0, Validators.min(0)]
    }));
  }

  removeProducto(index: number): void {
    this.productosArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.proveedorForm.invalid) {
      Object.keys(this.proveedorForm.controls).forEach(key => {
        const control = this.proveedorForm.get(key);
        if (control) control.markAsTouched();
      });
      this.productosArray.controls.forEach(group => {
        Object.keys((group as FormGroup).controls).forEach(key => {
          (group as FormGroup).get(key)?.markAsTouched();
        });
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const proveedor: Proveedor = {
      IdProveedor: this.proveedorId || 0,
      Empresa: this.proveedorForm.value.Empresa,
      Contacto: this.proveedorForm.value.Contacto,
      IdUsuario: this.proveedorForm.value.IdUsuario ? +this.proveedorForm.value.IdUsuario : undefined
    };

    const request = this.isEditMode
      ? this.proveedorService.update(this.proveedorId!, proveedor)
      : this.proveedorService.create(proveedor);

    request.subscribe({
      next: (result: any) => {
        const provId = this.isEditMode ? this.proveedorId! : result.IdProveedor;
        const productosData = this.productosArray.value;

        if (productosData.length === 0) {
          this.loading = false;
          this.router.navigate(['/proveedores']);
          return;
        }

        let saved = 0;
        for (const prod of productosData) {
          if (!prod.NombreProd) continue;
          const producto: Producto = {
            IdProducto: 0,
            NombreProd: prod.NombreProd,
            PrecioCompra: +prod.PrecioCompra,
            PrecioVenta: +prod.PrecioVenta,
            Stock: +prod.Stock || 0,
            IdProveedor: provId
          };
          this.productoService.create(producto).subscribe({
            next: () => {
              saved++;
              if (saved >= productosData.length) {
                this.loading = false;
                this.router.navigate(['/productos']);
              }
            },
            error: (err) => {
              console.error('Error al crear producto', err);
              saved++;
              if (saved >= productosData.length) {
                this.loading = false;
                this.router.navigate(['/proveedores']);
              }
            }
          });
        }
      },
      error: (err) => {
        this.error = this.isEditMode ? 'Error al actualizar proveedor' : 'Error al crear proveedor';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/proveedores']);
  }
}
