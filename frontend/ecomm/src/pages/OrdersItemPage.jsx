import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderItemPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order #{order.id} Details</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
      <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Items:</h3>
        {order.items.map(item => (
          <div key={item.id} className="border-b py-2">
            <p><strong>{item.product.name}</strong></p>
            <p>Qty: {item.quantity}</p>
            <p>Price: ₹{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemPage;
