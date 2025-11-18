import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Get the user's cart
export const getCart = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const cart = await prisma.cart.findUnique({
            where: { userId: parseInt(userId, 10) },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        const totalPrice = cart.items.reduce((total: number, item: any) => {
            return total + item.product.price * item.quantity;
        }, 0);

        res.status(200).json({ ...cart, totalPrice });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the cart' });
    }
};

// Add an item to the cart
export const addCartItem = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { productId, quantity } = req.body;

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || product.stock < quantity) {
            return res.status(400).json({ error: 'Product is not available in the requested quantity' });
        }

        let cart = await prisma.cart.findUnique({
            where: { userId: parseInt(userId, 10) },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: parseInt(userId, 10) },
            });
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the item to the cart' });
    }
};

// Update a cart item's quantity
export const updateCartItem = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(id, 10) },
            include: { cart: true, product: true },
        });

        if (!cartItem || cartItem.cart.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (cartItem.product.stock < quantity) {
            return res.status(400).json({ error: 'Product is not available in the requested quantity' });
        }

        await prisma.cartItem.update({
            where: { id: parseInt(id, 10) },
            data: { quantity },
        });

        res.status(200).json({ message: 'Cart item updated' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the cart item' });
    }
};

// Remove an item from the cart
export const removeCartItem = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(id, 10) },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(id, 10) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while removing the cart item' });
    }
};
