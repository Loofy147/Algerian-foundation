import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../products.controller';
import { PrismaClient } from '@prisma/client';

const prisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Product Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      await getAllProducts(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Test Product' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      await getProductById(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      (req as any).userId = '1';
      req.body = { name: 'New Product' };
      const newProduct = { id: 2, name: 'New Product' };
      (prisma.product.create as jest.Mock).mockResolvedValue(newProduct);
      await createProduct(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      (req as any).userId = '1';
      req.body = { name: 'Updated Product' };
      const product = { id: 1, name: 'Test Product', vendorId: 1 };
      const updatedProduct = { id: 1, name: 'Updated Product' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);
      await updateProduct(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      (req as any).userId = '1';
      const product = { id: 1, name: 'Test Product', vendorId: 1 };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      await deleteProduct(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
