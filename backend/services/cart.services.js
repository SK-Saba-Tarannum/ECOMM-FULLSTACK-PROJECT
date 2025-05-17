import prisma from '../config/db.js';

export const getUserCart = (userId) =>
prisma.cartItem.findMany({ where: { userId }, include: { product: true } });

export const addItem = (userId, { productId, quantity }) =>
prisma.cartItem.create({ data: { userId, productId, quantity } });

export const updateItem = (id, quantity) =>
prisma.cartItem.update({ where: { id }, data: { quantity } });

export const removeItem = (id) =>
prisma.cartItem.delete({ where: { id } });