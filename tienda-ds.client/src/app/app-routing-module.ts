import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductoFormComponent } from './components/productos/producto-form.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteFormComponent } from './components/clientes/cliente-form.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { VentaFormComponent } from './components/ventas/venta-form.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ProveedorFormComponent } from './components/proveedores/proveedor-form.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Usuarios - rutas específicas primero
  { path: 'usuarios/nuevo', component: UsuarioFormComponent },
  { path: 'usuarios/editar/:id', component: UsuarioFormComponent },
  { path: 'usuarios', component: UsuariosComponent },

  // Clientes - rutas específicas primero
  { path: 'clientes/nuevo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },
  { path: 'clientes', component: ClientesComponent },

  // Proveedores - rutas específicas primero
  { path: 'proveedores/nuevo', component: ProveedorFormComponent },
  { path: 'proveedores/editar/:id', component: ProveedorFormComponent },
  { path: 'proveedores', component: ProveedoresComponent },

  // Productos - rutas específicas primero
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'productos', component: ProductosComponent },

  // Ventas - rutas específicas primero
  { path: 'ventas/nuevo', component: VentaFormComponent },
  { path: 'ventas/editar/:id', component: VentaFormComponent },
  { path: 'ventas', component: VentasComponent },

  // Otras rutas
  { path: 'facturas', component: FacturasComponent },
  { path: 'contabilidad', component: ContabilidadComponent },

  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
