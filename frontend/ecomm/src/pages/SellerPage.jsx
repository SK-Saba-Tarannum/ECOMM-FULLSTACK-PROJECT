import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);

  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('userId'));

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const sellerProducts = res.data.filter((product) => product.sellerId === userId);
      setProducts(sellerProducts);
    } catch (err) {
      console.error('Failed to fetch products', err);
      alert('Failed to load products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl: '',
    });
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      sellerId: userId,
    };

    try {
      if (editingProductId) {
        await axios.put(`http://localhost:5000/api/products/${editingProductId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product. Please check the inputs or try again later.');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setEditingProductId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Error deleting product.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-500">Your Products</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-2 max-w-2xl mx-auto mb-8"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          {editingProductId ? 'Edit Product' : 'Add New Product'}
        </h2>

        <div className="flex flex-col gap-2">
          {['name', 'category', 'imageUrl'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          ))}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:col-span-2"
            rows={3}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="0"
            step="0.01"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="0"
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {editingProductId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-1 rounded-md transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-md transition"
          >
            {editingProductId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="max-w-6xl mx-auto gap-3 flex flex-col">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg col-span-full">No products listed yet.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/300x200.png?text=No+Image+Available';
                  }}
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-2 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-gray-600 mt-2 flex-grow line-clamp-3">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="font-semibold text-lg text-blue-600">₹{product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerPage;
