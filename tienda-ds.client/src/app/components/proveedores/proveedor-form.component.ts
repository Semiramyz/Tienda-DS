import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { UsuarioService } from '../../services/usuario.service';
import { Proveedor } from '../../models/proveedor.model';
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
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.proveedorForm = this.fb.group({
      Empresa: ['', [Validators.required, Validators.minLength(3)]],
      Contacto: [''],
      IdUsuario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.proveedorId = +id;
      this.loadProveedor(this.proveedorId);
    }
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.filter(u => u.Rol === 'Proveedor');
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  loadProveedor(id: number): void {
    this.loading = true;
    this.proveedorService.getById(id).subscribe({
      next: (proveedor) => {
        this.proveedorForm.patchValue({
          Empresa: proveedor.Empresa,
          Contacto: proveedor.Contacto,
          IdUsuario: proveedor.IdUsuario
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar proveedor';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.proveedorForm.invalid) {
      Object.keys(this.proveedorForm.controls).forEach(key => {
        this.proveedorForm.controls[key].markAsTouched();
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
      next: () => {
        this.loading = false;
        this.router.navigate(['/proveedores']);
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
