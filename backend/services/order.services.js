import prisma from '../config/db.js';

export const checkout = async (userId) => {
const cartItems = await prisma.cartItem.findMany({
where: { userId },
include: { product: true },
});

const total = cartItems.reduce(
(sum, item) => sum + item.product.price * item.quantity,
0
);

const order = await prisma.order.create({
data: {
userId,
total,
items: {
create: cartItems.map((item) => ({
productId: item.productId,
quantity: item.quantity,
price: item.product.price,
})),
},
},
});

await prisma.cartItem.deleteMany({ where: { userId } });

return order;
};

export const getUserOrders = (userId) =>
prisma.order.findMany({
where: { userId },
include: { items: { include: { product: true } } },
});

export const getOrderById = (orderId, userId) =>
    prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }).then(order => {
      // Optional: protect access
      if (!order || order.userId !== userId) {
        throw new Error('Unauthorized or Order not found');
      }
      return order;
    });
  