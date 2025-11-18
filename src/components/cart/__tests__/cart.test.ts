import { Request, Response } from 'express';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '../cart.controller';
import { PrismaClient } from '@prisma/client';

const prisma = {
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Cart Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      body: {},
    };
    (req as any).userId = '1';
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return the user cart', async () => {
      const cart = { items: [{ product: { price: 10 }, quantity: 2 }] };
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(cart);
      await getCart(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...cart, totalPrice: 20 });
    });
  });

  describe('addCartItem', () => {
    it('should add an item to the cart', async () => {
      req.body = { productId: 1, quantity: 1 };
      const product = { id: 1, stock: 10 };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
      await addCartItem(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item', async () => {
      req.body = { quantity: 2 };
      const cartItem = { id: 1, cart: { userId: 1 }, product: { stock: 10 } };
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(cartItem);
      await updateCartItem(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeCartItem', () => {
    it('should remove a cart item', async () => {
      const cartItem = { id: 1, cart: { userId: 1 } };
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(cartItem);
      await removeCartItem(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
