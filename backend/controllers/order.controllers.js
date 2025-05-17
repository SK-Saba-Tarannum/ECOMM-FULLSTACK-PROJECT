import prisma  from '../utils/prismaClient.js';



export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Get product details to fetch price
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const total = product.price * quantity;

    // Create order with associated items
    const order = await prisma.order.create({
      data: {
        userId,
        total, // ✅ FIX: Include total
        items: {
          create: [
            {
              productId,
              quantity,
              price: product.price,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};



export const getMyOrders = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      res.status(200).json(orders);
    } catch (err) {
      console.error("Fetching orders failed:", err);
      res.status(500).json({ error: "Could not fetch orders" });
    }
  };

  export const getUserOrders = async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch orders ${error}` });
    }
  };
  
  export const getOrderById = async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(req.params.orderId) },
        include: {
          items: { include: { product: true } }
        }
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch order details ${error}` });
    }
  };
  