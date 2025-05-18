import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCartIcon, ShoppingBagIcon, LogInIcon, StarIcon } from "lucide-react";
import axios from "axios";

function MainPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://ecomm-fullstack-project.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = async (product) => {
    if (!token) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://ecomm-fullstack-project.onrender.com/api/cart", 
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${product.name} added to cart!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const addToWishlist = async (product) => {
    if (!token) {
      alert("Please login to add items to wishlist.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://ecomm-fullstack-project.onrender.com/api/wishlist",
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${product.name} added to wishlist!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    }
  };


  
  const buyNow = async (product) => {
    if (!token) {
      alert("Please login to buy products.");
      navigate("/login");
      return;
    }
  
    try {
      const res = await axios.post("https://ecomm-fullstack-project.onrender.com/api/orders", 
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const orderId = res.data.id;
      console.log(orderId)
      navigate(`/orders/${orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create order");
    }
  }; console.log(buyNow)
  

  const goToCart = () => navigate("/addtocart");
  const goToWishlist = () => navigate("/wishlist");
    const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);

  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div className="flex items-center gap-2 text-black">
          <ShoppingBagIcon className="size-8 text-yellow-300 fill-black" />
          <h1 className="text-2xl font-bold">Babool Store</h1>
        </div>
        <div className="relative flex gap-2 bg-white rounded-md">
          <input
            type="text"
            placeholder="Search products..."
            className="p-1 w-full rounded-md text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>
            <Search className="size-6 text-black pt-2" />
          </span>
        </div>
        <section className="relative gap-4 flex items-center">
          {!token && (
            <button onClick={() => navigate("/login")} className="relative bg-transparent">
              <LogInIcon />
            </button>
          )}
          <button onClick={goToCart} className="relative bg-transparent">
            <ShoppingCartIcon className="size-6 fill-black" />
          </button>
          <button onClick={goToWishlist} className="relative bg-transparent">
            <Heart className="size-6 text-red-500 fill-white" />
          </button>
        </section>
      </header>

      <div className="p-16 bg-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-md p-4 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Heart
                className="absolute top-2 right-2 text-red-500 cursor-pointer hover:scale-110 transition"
                onClick={() => addToWishlist(product)}
              />
              <h2 className="font-bold text-lg mb-2">{product.name}</h2>
              <div className="mb-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-60 object-contain rounded-md"
                  onClick={() => handleProductClick(product.id)}
                />
              </div>
              <p className="mb-1">
                <span className="font-bold">Price:</span> ${product.price}
              </p>
              
            
              <p className="text-sm text-gray-800 mb-2 line-clamp-1">
                {product.description}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  className="bg-black p-1 text-white rounded-md w-full text-center font-bold hover:cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-yellow-400 p-1 rounded-md w-full font-bold hover:cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                  // onClick={() => buyNow(product)}

                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;












