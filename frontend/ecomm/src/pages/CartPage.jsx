import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load cart", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!cartItems.length)
    return <div className="text-center mt-10 text-gray-600">Your cart is empty.</div>;

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between border rounded-md p-4 shadow-sm"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              {item.product.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded"
                />
              )}
              <div>
                <p className="font-semibold text-lg">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.product.price.toFixed(2)} × {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-2">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right text-lg font-semibold">
        Total: ${total.toFixed(2)}
      </div>

      <div className="text-right mt-4">
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

