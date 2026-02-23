En este archivo se explica cómo Visual Studio creado el proyecto.

Se usaron las siguientes herramientas para generar este proyecto:
- Angular CLI (ng)

Los pasos siguientes se usaron para generar este proyecto:
- Cree un proyecto de Angular con ng: `ng new tienda-ds.client --defaults --skip-install --skip-git --no-standalone `.
- Agregar `proxy.conf.js` a las llamadas de proxy al servidor ASP.NET back-end.
- Agregue `aspnetcore-https.js` un script para instalar los certificados HTTPS.
- Actualizar `package.json` para llamar `aspnetcore-https.js` y servir con https.
- Actualizar `angular.json` para que apunte a `proxy.conf.js`.
- Actualice el componente app.ts para capturar y mostrar información meteorológica.
- Modificar app.spec.ts con pruebas actualizadas.
- Actualice app-module.ts para importar HttpClientModule.
- Crear archivo de proyecto (`tienda-ds.client.esproj`).
- Crear `launch.json` para habilitar la depuración.
- Actualice package.json para agregar `jest-editor-support`.
- Actualice package.json para agregar `run-script-os`.
- Agregar `karma.conf.js` para pruebas unitarias.
- Actualizar `angular.json` para que apunte a `karma.conf.js`.
- Agregue el proyecto a la solución.
- Actualice el punto de conexión de proxy para que sea el punto de conexión del servidor back-end.
- Agregar proyecto a la lista de proyectos de inicio.
- Escriba este archivo.
