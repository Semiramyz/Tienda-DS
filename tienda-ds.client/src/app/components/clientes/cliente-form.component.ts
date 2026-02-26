import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { UsuarioService } from '../../services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  standalone: false
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId: number | null = null;
  loading = false;
  error: string | null = null;
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(3)]],
      NitCedula: [''],
      IdUsuario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clienteId = +id;
      this.loadCliente(this.clienteId);
    }
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.filter(u => u.Rol === 'Cliente');
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getById(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          Nombre: cliente.Nombre,
          NitCedula: cliente.NitCedula,
          IdUsuario: cliente.IdUsuario
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar cliente';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      Object.keys(this.clienteForm.controls).forEach(key => {
        this.clienteForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const cliente: Cliente = {
      IdCliente: this.clienteId || 0,
      Nombre: this.clienteForm.value.Nombre,
      NitCedula: this.clienteForm.value.NitCedula,
      IdUsuario: this.clienteForm.value.IdUsuario ? +this.clienteForm.value.IdUsuario : undefined
    };

    const request = this.isEditMode
      ? this.clienteService.update(this.clienteId!, cliente)
      : this.clienteService.create(cliente);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.error = this.isEditMode ? 'Error al actualizar cliente' : 'Error al crear cliente';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }
}
