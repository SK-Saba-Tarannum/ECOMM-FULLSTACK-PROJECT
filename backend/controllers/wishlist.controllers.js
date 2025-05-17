import {
    getWishlistService,
    addToWishlistService,
    removeFromWishlistService,
  } from '../services/wishlist.services.js';
  
  export const getWishlist = async (req, res) => {
    try {
      const wishlist = await getWishlistService(req.user.id);
      res.json(wishlist);
    } catch (error) {
      console.error('Error in getWishlist:', error);
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  };
  
  export const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
      const item = await addToWishlistService(req.user.id, productId);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error in addToWishlist:', error);
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  };
  
  export const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    try {
      await removeFromWishlistService(req.user.id, parseInt(productId));
      res.status(204).end();
    } catch (error) {
      console.error('Error in removeFromWishlist:', error);
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  };
  