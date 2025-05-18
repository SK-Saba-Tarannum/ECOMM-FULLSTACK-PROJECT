import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrdersPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Items</h3>
        {order.orderItems?.length === 0 ? (
          <p>No items in this order.</p>
        ) : (
          <ul className="space-y-2">
            {order.orderItems?.map(item => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{item.product?.name || 'Unnamed Product'}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Price: ₹{item.price?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-sm font-semibold">
                    Subtotal: ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
