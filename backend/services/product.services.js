import prisma from '../config/db.js';

export const getAll = () => prisma.product.findMany();

export const create = (data, sellerId) =>
  prisma.product.create({ data: { ...data, sellerId: Number(sellerId) } });

export const update = (id, data) =>
  prisma.product.update({ where: { id: Number(id) }, data });

export const remove = (id) =>
  prisma.product.delete({ where: { id: Number(id) } });
