import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  image_url: string;
  quantity: number;
  price: number | null;
  original_price: number | null;
  is_on_sale: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalSavings: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: {
    id: number;
    name: string;
    image_url: string;
    price?: number | null;
    original_price?: number | null;
    is_on_sale?: boolean;
  }, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                // Update prices if they were missing before
                price: item.price || product.price || null,
                original_price: item.original_price || product.original_price || null,
                is_on_sale: item.is_on_sale || product.is_on_sale || false
              }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          image_url: product.image_url,
          quantity,
          price: product.price || null,
          original_price: product.original_price || null,
          is_on_sale: product.is_on_sale || false
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + ((item.price || 0) * item.quantity);
    }, 0);
  };

  const getTotalSavings = () => {
    return items.reduce((savings, item) => {
      if (item.is_on_sale && item.original_price && item.price) {
        return savings + ((item.original_price - item.price) * item.quantity);
      }
      return savings;
    }, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalSavings
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 