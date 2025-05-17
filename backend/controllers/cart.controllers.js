import * as cartService from '../services/cart.services.js';

export const getCart = async (req, res) => {
  const items = await cartService.getUserCart(Number(req.user.id));
  res.json(items);
};

export const addToCart = async (req, res) => {
  const item = await cartService.addItem(Number(req.user.id), req.body);
  res.status(201).json(item);
};

export const updateCartItem = async (req, res) => {
  const updated = await cartService.updateItem(Number(req.params.id), req.body.quantity);
  res.json(updated);
};

export const removeFromCart = async (req, res) => {
  await cartService.removeItem(Number(req.params.id));
  res.status(204).end();
};
