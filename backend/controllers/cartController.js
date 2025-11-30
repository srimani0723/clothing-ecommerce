const Cart = require("../models/Cart");

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    res.json(cart || { user: req.user.userId, items: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, size, qty = 1 } = req.body;
    if (!productId || !size) {
      return res
        .status(400)
        .json({ message: "productId and size are required" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    const existing = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ product: productId, size, qty });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/cart/update
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, size, qty } = req.body;
    if (!productId || !size || qty == null) {
      return res.status(400).json({ message: "productId, size, qty required" });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size
    );
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => !(i.product.toString() === productId && i.size === size)
      );
    } else {
      item.qty = qty;
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/remove
exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ message: "productId and size required" });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.size === size)
    );

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: merge localStorage guest cart into user cart on login
exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, size, qty }]
    if (!Array.isArray(items))
      return res.status(400).json({ message: "items must be array" });

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) cart = await Cart.create({ user: req.user.userId, items: [] });

    for (const it of items) {
      const existing = cart.items.find(
        (i) => i.product.toString() === it.productId && i.size === it.size
      );
      if (existing) existing.qty += it.qty;
      else
        cart.items.push({ product: it.productId, size: it.size, qty: it.qty });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    console.error("Merge cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
