import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ShoppingCart,StarIcon } from "lucide-react";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { id: productId } = useParams();

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:5000/api/products/${productId}`)

      // fetch(`http://localhost:5000/api/products/${productId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        })
        .then((data) => setProduct(data))
        .catch(() => setProduct(null));
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image and buttons */}
        <div className=" flex flex-col">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-56 h-50 object-contain rounded-md mb-4"
          />

          <div className="flex gap-4 mb-4">
            <button
              className={`flex items-center bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300`}
              onClick={() => {
                // Add to cart logic (e.g., localStorage or backend)
                alert(`${product.name} added to cart`);
              }}
              disabled={product.stock === 0}
              title={product.stock === 0 ? "Out of stock" : "Add to Cart"}
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </button>

            <button
              onClick={() => {
                localStorage.setItem("buyNow", JSON.stringify(product));
                navigate("/paymentpage");
              }}
              className="bg-yellow-400 text-black font-bold px-4 py-3 rounded hover:bg-yellow-500"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Product details */}
        <div className="md:w-1/2 flex flex-col justify-center space-y-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-xl text-green-600 font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">Stock:</span>{" "}
            {product.stock > 0 ? product.stock : "Out of stock"}
          </p>
          <p>
            <span className="font-bold">Category:</span> {product.category}
          </p>
          <p className="text-sm text-gray-700 mb-2 flex items-center">
                {Array.from({ length: Math.round(product.rating || 4) }).map((_, idx) => (
                  <StarIcon key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
          </p>
              
          {/* <p>{product.rating}</p> */}
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;





















