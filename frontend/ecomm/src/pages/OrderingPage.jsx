import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderingPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/cart", {
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
        setError("Failed to fetch cart items");
        setLoading(false);
      });
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const handlePayment = () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert("Please fill in all payment fields.");
      return;
    }

    // Fake payment process
    alert(`Payment of $${totalAmount.toFixed(2)} successful!`);
    // You could redirect or send data to your backend/payment gateway here
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-96 mx-auto p-6 bg-slate-200 mt-20">
      <h1 className="text-2xl text-blue-500 text-center font-bold mb-6">Checkout</h1>

      <div className="bg-gray-300 shadow-md rounded-lg p-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="  flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <h2 className="text-2xl text-center text-blue-500 font-semibold mb-4">Payment Details</h2>
      <div className="space-y-4 bg-slate-300 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-1/2 border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-1/2 border px-4 py-1 rounded"
          />
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Pay ${totalAmount.toFixed(2)}
      </button>
    </div>
  );
};

export default OrderingPage;
