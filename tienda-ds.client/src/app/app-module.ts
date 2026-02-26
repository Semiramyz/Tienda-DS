import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
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

@NgModule({
  declarations: [
    App,
    HomeComponent,
    ProductosComponent,
    ProductoFormComponent,
    ClientesComponent,
    ClienteFormComponent,
    VentasComponent,
    VentaFormComponent,
    ProveedoresComponent,
    ProveedorFormComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    FacturasComponent,
    ContabilidadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
