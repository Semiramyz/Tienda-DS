# 🚀 Guía de Inicio - Sistema de Gestión de Tienda

## ✅ Verificaciones Implementadas

### Backend (.NET 8)
- ✅ Pipeline de middleware corregido (orden correcto)
- ✅ CORS configurado con `AllowAnyOrigin`
- ✅ Logging detallado en controladores
- ✅ Test de conexión a base de datos al inicio
- ✅ Endpoint de health check: `/api/health`
- ✅ Manejo de errores mejorado
- ✅ DTOs implementados para evitar referencias circulares

### Frontend (Angular)
- ✅ Proxy configurado para `/api`
- ✅ Modelos con PascalCase (compatibles con C#)
- ✅ Rutas ordenadas correctamente
- ✅ CRUD completo en todos los módulos

---

## 🔧 Pasos para Iniciar (RECOMENDADO)

### 1️⃣ Verificar el Estado

**Ejecuta en PowerShell (como Administrador):**
```powershell
.\verify-backend.ps1
```

Este script verificará:
- ✅ MySQL está corriendo
- ✅ Puerto 7261 está libre/ocupado
- ✅ API responde correctamente
- ✅ Base de datos es accesible
- ✅ Endpoints funcionan

---

### 2️⃣ Iniciar el Backend

#### Opción A: Con el Script (Recomendado)
```powershell
.\start-backend.ps1
```

#### Opción B: Manual desde PowerShell
```powershell
cd Tienda-DS.Server
dotnet run
```

#### Opción C: Desde Visual Studio
1. Abre `Tienda-DS.sln`
2. Establece `Tienda-DS.Server` como proyecto de inicio
3. Presiona `F5` o clic en el botón verde ▶️

**Verás en consola:**
```
✅ Database connection successful!
🚀 Backend running on: https://localhost:7261
📍 API endpoints available at: /api/*
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7261
```

---

### 3️⃣ Probar el Backend

**Abre en el navegador:**
```
https://localhost:7261/api/health
```

**Deberías ver:**
```json
{
  "status": "OK",
  "message": "Backend is running",
  "timestamp": "2024-02-26T03:30:00Z"
}
```

**Probar endpoint de usuarios:**
```
https://localhost:7261/api/usuarios
```

**Deberías ver:**
```json
[]
```
O un array con usuarios si ya existen en la base de datos.

---

### 4️⃣ Iniciar el Frontend (en otra terminal)

```powershell
cd tienda-ds.client
npm start
```

**Espera a ver:**
```
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:55320 **
```

---

### 5️⃣ Abrir la Aplicación

**Navega a:**
```
https://localhost:55320
```

---

## 🐛 Solución de Problemas

### Problema: Backend no inicia

**Verificar MySQL:**
```powershell
Get-Service MySQL80
# Si está detenido:
Start-Service MySQL80
```

**Verificar puerto ocupado:**
```powershell
Get-NetTCPConnection -LocalPort 7261
# Si está ocupado, matar el proceso:
Stop-Process -Id <PID> -Force
```

---

### Problema: "Cannot connect to database"

**Verifica la conexión manualmente:**
```powershell
mysql -u root -p
# Ingresa password: 12345
USE tienda-sd;
SHOW TABLES;
```

**Si la base de datos no existe:**
```sql
CREATE DATABASE `tienda-sd`;
```

---

### Problema: Frontend muestra "Cargando..."

**Abre la consola del navegador (F12):**
- Pestaña **Console**: busca errores en rojo
- Pestaña **Network**: 
  - Filtra por "usuarios"
  - Verifica que el Status sea `200 OK`
  - Verifica que Response sea JSON, no HTML

**Si ves HTML en lugar de JSON:**
- Reinicia el backend
- Limpia caché del navegador (`Ctrl+Shift+R`)
- Verifica que el proxy esté configurado correctamente

---

### Problema: Errores CORS

**Verifica en la consola del navegador:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución:**
Ya está configurado en `Program.cs`, pero asegúrate de que el backend esté corriendo con esta configuración.

---

## 📊 Endpoints Disponibles

### Health Check
- `GET /api/health` - Estado del servidor
- `GET /api/health/ping` - Ping simple

### Usuarios
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/{id}` - Obtener por ID
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/{id}` - Actualizar
- `DELETE /api/usuarios/{id}` - Eliminar

### Clientes
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/{id}` - Obtener por ID
- `POST /api/clientes` - Crear
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar

### Proveedores
- `GET /api/proveedores` - Listar todos
- `GET /api/proveedores/{id}` - Obtener por ID
- `POST /api/proveedores` - Crear
- `PUT /api/proveedores/{id}` - Actualizar
- `DELETE /api/proveedores/{id}` - Eliminar

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/{id}` - Obtener por ID
- `POST /api/productos` - Crear
- `PUT /api/productos/{id}` - Actualizar
- `DELETE /api/productos/{id}` - Eliminar

### Ventas
- `GET /api/ventas` - Listar todas
- `GET /api/ventas/{id}` - Obtener por ID
- `POST /api/ventas` - Crear
- `PUT /api/ventas/{id}` - Actualizar
- `DELETE /api/ventas/{id}` - Eliminar

---

## 📝 Logs y Debug

### Ver logs del backend
Los logs aparecen automáticamente en la consola donde ejecutas `dotnet run`.

**Ejemplo de logs correctos:**
```
info: Tienda_DS.Server.Controllers.UsuariosController[0]
      GET /api/usuarios - Fetching all users
info: Tienda_DS.Server.Controllers.UsuariosController[0]
      GET /api/usuarios - Returned 3 users
```

### Ver logs de Angular
```powershell
cd tienda-ds.client
npm start
```

### Ver logs de peticiones HTTP
Abre F12 en el navegador → Pestaña Network

---

## 🎯 Orden de Creación de Datos

1. **Usuarios** (con roles: Admin, Vendedor, Cliente, Proveedor)
2. **Clientes** (asociados a usuarios con rol Cliente)
3. **Proveedores** (asociados a usuarios con rol Proveedor)
4. **Productos** (asociados a proveedores)
5. **Ventas** (requiere cliente, producto y usuario vendedor)

---

## ✅ Checklist Final

- [ ] MySQL corriendo
- [ ] Base de datos `tienda-sd` existe
- [ ] Backend responde en `https://localhost:7261/api/health`
- [ ] `/api/usuarios` devuelve JSON (no HTML)
- [ ] Frontend corre en `https://localhost:55320`
- [ ] No hay errores en la consola del navegador
- [ ] Proxy configurado correctamente

---

## 🚨 Errores Comunes y Soluciones

| Error | Solución |
|-------|----------|
| "Unexpected token '<'" | Backend devuelve HTML. Verificar que `/api/usuarios` devuelva JSON |
| "Cannot GET /api/usuarios" | Backend no está corriendo o puerto incorrecto |
| "CORS error" | Ya corregido en `Program.cs`, reiniciar backend |
| "Cannot connect to database" | Verificar MySQL y credenciales |
| "Port already in use" | Matar proceso con `Stop-Process` |

---

**¡Sistema listo para usar!** 🎉
