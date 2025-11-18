import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

// Get all products (public)
export const getAllProducts = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, vendor: { select: { email: true } } },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};

// Get a single product by ID (public)
export const getProductById = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId; // Can be undefined for anonymous users

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { category: true, vendor: { select: { email: true } } },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Log the product view for future AI analysis
    logger.info('PRODUCT_VIEW', {
      productId: product.id,
      productName: product.name,
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

// Create a new product (vendor only)
export const createProduct = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, images, categoryId } = req.body;
    const vendorId = (req as any).userId;

    if (!vendorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        images,
        vendorId: parseInt(vendorId, 10),
        categoryId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the product' });
  }
};

// Update a product (vendor only)
export const updateProduct = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, images, categoryId } = req.body;
        const vendorId = (req as any).userId;

        if (!vendorId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!product || product.vendorId !== parseInt(vendorId, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: { name, description, price, stock, images, categoryId },
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};

// Delete a product (vendor only)
export const deleteProduct = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendorId = (req as any).userId;

        if (!vendorId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!product || product.vendorId !== parseInt(vendorId, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.product.delete({
            where: { id: parseInt(id, 10) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};
