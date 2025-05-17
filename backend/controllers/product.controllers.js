
import * as productService from '../services/product.services.js';
import prisma  from '../utils/prismaClient.js';

export const getAllProducts = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

// controllers/product.controllers.js

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }, // assuming your ID is Int
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const createProduct = async (req, res) => {
  const sellerId = req.user.id; // already an Int from token
  const product = await productService.create(req.body, sellerId);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updated = await productService.update(productId, req.body);
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  await productService.remove(productId);
  res.status(204).end();
};
