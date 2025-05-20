const axios = require('axios');

describe('Validate FakeStoreAPI products', () => {
  let products = [];

  beforeAll(async () => {
    const res = await axios.get('https://fakestoreapi.com/products');
    expect(res.status).toBe(200);
    products = res.data;
  });

  it('should contain valid product data', () => {
    const defectiveProducts = [];

    products.forEach((product) => {
      const issues = [];

      if (!product.title || product.title.trim() === '') {
        issues.push('Empty title');
      }

      if (typeof product.price !== 'number' || product.price < 0) {
        issues.push(`Invalid price: ${product.price}`);
      }

      if (product.rating && product.rating.rate > 5) {
        issues.push(`Rating > 5: ${product.rating.rate}`);
      }

      if (issues.length > 0) {
        defectiveProducts.push({
          id: product.id,
          title: product.title,
          issues,
        });
      }
    });

    console.log('\n❌ Defective products found:\n');
    console.table(defectiveProducts);

    expect(defectiveProducts.length).toBe(0); // тест упадёт, если есть дефекты
  });
});
