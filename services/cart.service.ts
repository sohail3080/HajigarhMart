// Cart Service for managing shopping cart locally
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'shopping_cart';

class CartService {
  private cart: Cart | null = null;

  async getCart(): Promise<Cart | null> {
    if (this.cart) return this.cart;
    
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        this.cart = JSON.parse(cartData);
        return this.cart;
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    return null;
  }

  async addToCart(product: Product, quantity: number = 1): Promise<Cart> {
    const currentCart = await this.getCart();

    if (!currentCart) {
      // Create new cart
      this.cart = {
        shopId: product.shopId,
        shopName: '', // Will be fetched from shop data
        items: [{ product, quantity }],
        subtotal: product.price * quantity,
      };
    } else {
      // Check if product is from same shop
      if (currentCart.shopId !== product.shopId) {
        throw new Error('Cannot add items from different shops to cart');
      }

      // Check if product already exists in cart
      const existingItemIndex = currentCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        currentCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        currentCart.items.push({ product, quantity });
      }

      // Recalculate subtotal
      currentCart.subtotal = currentCart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      this.cart = currentCart;
    }

    await this.saveCart();
    return this.cart;
  }

  async updateQuantity(productId: string, quantity: number): Promise<Cart | null> {
    const currentCart = await this.getCart();
    if (!currentCart) return null;

    const itemIndex = currentCart.items.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex].quantity = quantity;
      }

      // Recalculate subtotal
      currentCart.subtotal = currentCart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      if (currentCart.items.length === 0) {
        await this.clearCart();
        return null;
      }

      this.cart = currentCart;
      await this.saveCart();
    }

    return this.cart;
  }

  async removeItem(productId: string): Promise<Cart | null> {
    return this.updateQuantity(productId, 0);
  }

  async clearCart(): Promise<void> {
    this.cart = null;
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }

  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    if (!cart) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  private async saveCart(): Promise<void> {
    if (!this.cart) return;
    
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }
}

export const cartService = new CartService();
export default cartService;

