import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        alert("Could not load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token, navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      alert("Failed to remove product from wishlist.",error);
    }
  };

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading wishlist...</div>;

  if (!wishlist.length) {
    return (
      <div className="text-center mt-10 text-gray-500 text-xl">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center ">My Wishlist</h2>

      <div className="space-y-4">
        {wishlist.map((item) => {
          const product = item.product;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => goToProduct(product.id)}
              >
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                  {product.description}
                </p>
                <p className="font-bold text-gray-800">${product.price}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => goToProduct(product.id)}
                  className="bg-yellow-400 px-3 py-1 rounded-md text-sm font-bold hover:bg-yellow-500 transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
