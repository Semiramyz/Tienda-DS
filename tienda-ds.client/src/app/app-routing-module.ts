import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'facturas', component: FacturasComponent },
  { path: 'contabilidad', component: ContabilidadComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
