import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

// Obtener la ruta del directorio actual
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const htmlFiles = ['aceites.html', 'vinagres.html', 'sal.html', 'bolleria.html'];

const allProducts = [];

htmlFiles.forEach(file => {
  console.log(`Procesando ${file}...`);
  const htmlContent = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  const root = parse(htmlContent);
  const productCells = root.querySelectorAll('.product-cell');

  if (productCells.length === 0) {
    console.log(`No se encontraron productos en ${file}`);
  }

  productCells.forEach(cell => {
    const name = cell.querySelector('.product-cell__description-name')?.text.trim();
    const price = cell.querySelector('.product-price__unit-price')?.text.trim();
    const size = cell.querySelector('.product-format__size--cell')?.text.trim();
    const imageUrl = cell.querySelector('img')?.getAttribute('src');

    allProducts.push({
      name,
      price,
      size,
      imageUrl
    });
  });
});

fs.writeFileSync(path.join(__dirname, 'datos_mercadona.json'), JSON.stringify(allProducts, null, 2), 'utf-8');
console.log(`Archivo JSON creado con ${allProducts.length} productos.`);

