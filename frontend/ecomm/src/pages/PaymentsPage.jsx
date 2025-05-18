import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const PaymentsPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    axios
      .get("https://ecomm-fullstack-project.onrender.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const items = Array.isArray(res.data)
          ? res.data
          : res.data.cartItems || [];
        setCartItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load cart items");
        setLoading(false);
      });
  }, []);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
        if (!item.product) return sum;
        return sum + item.product.price * item.quantity;
      }, 0)
    : 0;

  if (loading) return <div className="p-4">Loading cart items...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!cartItems.length)
    return <div className="p-4">Your cart is currently empty.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Review Your Order</h1>

      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="bg-slate-300 flex gap-4 border p-4 rounded-xl shadow-sm"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.product.name}</h2>
              <p className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)} x {item.quantity}
              </p>
              <p className="font-medium">
                Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {navigate("/orderingpage")}}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentsPage;
