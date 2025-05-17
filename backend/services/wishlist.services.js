import prisma  from '../utils/prismaClient.js';

export const getWishlistService = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });
};

export const addToWishlistService = async (userId, productId) => {
  return prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });
};

export const removeFromWishlistService = async (userId, productId) => {
  return prisma.wishlist.deleteMany({
    where: {
      userId,
      productId,
    },
  });
};
