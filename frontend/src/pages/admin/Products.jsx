import React from "react";

const products = [
  { id: "P-1001", name: "Leather Backpack", stock: 18, price: "$120", category: "Bags" },
  { id: "P-1002", name: "Running Shoes", stock: 34, price: "$89", category: "Shoes" },
  { id: "P-1003", name: "Travel Jacket", stock: 12, price: "$154", category: "Clothing" },
  { id: "P-1004", name: "Casual Watch", stock: 7, price: "$179", category: "Accessories" },
];

const Products = () => {
  return (
    <div className="admin-page products-page">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your product catalog, stock levels, and pricing.</p>
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>Product Catalog</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Products;
