import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from backend API on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming JWT token stored here
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    axios
      .get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Log response for debugging
        console.log("Cart API response:", res.data);

        // If your API returns an array directly, use it; else adjust here
        const items = Array.isArray(res.data) ? res.data : res.data.cartItems || [];
        setCartItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load cart items");
        setLoading(false);
      });
  }, []);

  // Calculate total price safely
  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
        if (!item.product) return sum;
        return sum + item.product.price * item.quantity;
      }, 0)
    : 0;

  if (loading) return <div>Loading cart items...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cartItems.length) return <div>Your cart is empty</div>;

  return (
    <div>
      <h1>Payment Page</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "1rem" }}>
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
            <div>
              <strong>{item.product.name}</strong>
            </div>
            <div>Price: ${item.product.price.toFixed(2)}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</div>
          </li>
        ))}
      </ul>
      <h2>Total: ${total.toFixed(2)}</h2>

      {/* Here you can add your payment form / button */}
      <button onClick={() => alert("Proceed to payment")}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;

