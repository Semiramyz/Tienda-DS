import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    ProductosComponent,
    ClientesComponent,
    VentasComponent,
    ProveedoresComponent,
    UsuariosComponent,
    FacturasComponent,
    ContabilidadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
