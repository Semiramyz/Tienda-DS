import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
  standalone: false
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode = false;
  usuarioId: number | null = null;
  loading = false;
  error: string | null = null;

  roles = ['admin', 'vendedor', 'proveedor', 'comprador'];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      NombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usuarioId = +id;
      this.loadUsuario(this.usuarioId);
      this.usuarioForm.get('Password')?.clearValidators();
      this.usuarioForm.get('Password')?.updateValueAndValidity();
    }
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.usuarioService.getById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          NombreUsuario: usuario.NombreUsuario,
          Rol: usuario.Rol
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuario';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const usuario: Usuario = {
      IdUsuario: this.usuarioId || 0,
      NombreUsuario: this.usuarioForm.value.NombreUsuario,
      Password: this.usuarioForm.value.Password || '',
      Rol: this.usuarioForm.value.Rol
    };

    const request = this.isEditMode
      ? this.usuarioService.update(this.usuarioId!, usuario)
      : this.usuarioService.create(usuario);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.error = this.isEditMode ? 'Error al actualizar usuario' : 'Error al crear usuario';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }
}
