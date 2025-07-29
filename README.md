# Reporte FONPLATA - IATI

Este proyecto es un reporte interactivo de una página, hecho con React y D3.js, listo para ser desplegado en GitHub Pages.

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Para desarrollo local:
   ```bash
   npm start
   ```

3. Para construir la versión lista para GitHub Pages:
   ```bash
   npm run build
   ```
   Los archivos finales estarán en la carpeta `dist/` y puedes subirlos directamente a tu GitHub Pages.

## Estructura
- `src/index.html`: HTML principal, con el título centrado.
- `src/index.js`: Punto de entrada de React.
- `src/App.js`: Componente principal, aquí puedes agregar tus gráficos D3.js.

## Notas
- No requiere backend ni base de datos, puedes definir tus datos directamente en los componentes.
- Puedes agregar más componentes o gráficos según lo necesites. 