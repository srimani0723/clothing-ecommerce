import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

const CART_KEY = "cartItems";

const getInitialCart = () => {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
};

const initialState = {
  // guest cart list
  items: getInitialCart(),
  // server cart for logged-in user
  serverCart: null,
  loading: false,
  error: null,
};

// -------- SERVER CART THUNKS (for logged-in users) --------

// GET /api/cart
export const fetchServerCart = createAsyncThunk(
  "cart/fetchServerCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart");
      return res.data; // cart document
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

// POST /api/cart/add
export const addToServerCart = createAsyncThunk(
  "cart/addToServerCart",
  async ({ productId, size, qty = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.post("/cart/add", { productId, size, qty });
      return res.data; // updated cart
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

// PUT /api/cart/update
export const updateServerCartItem = createAsyncThunk(
  "cart/updateServerCartItem",
  async ({ productId, size, qty }, { rejectWithValue }) => {
    try {
      const res = await api.put("/cart/update", { productId, size, qty });
      return res.data; // updated cart
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update cart failed"
      );
    }
  }
);

// DELETE /api/cart/remove
export const removeFromServerCart = createAsyncThunk(
  "cart/removeFromServerCart",
  async ({ productId, size }, { rejectWithValue }) => {
    try {
      const res = await api.delete("/cart/remove", {
        data: { productId, size },
      });
      return res.data; // updated cart
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Remove from cart failed"
      );
    }
  }
);

// POST /api/cart/merge (optional)
export const mergeCartWithServer = createAsyncThunk(
  "cart/mergeCartWithServer",
  async (items, { rejectWithValue }) => {
    try {
      const payload = items.map((i) => ({
        productId: i.productId,
        size: i.size,
        qty: i.qty,
      }));
      const res = await api.post("/cart/merge", { items: payload });
      return res.data; // server cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Merge failed");
    }
  }
);

// -------- LOCAL CART REDUCERS (for guests) --------

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // guest add
    addToLocalCart: (state, action) => {
      const { productId, name, image, price, size } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size
      );
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ productId, name, image, price, size, qty: 1 });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    // guest update
    updateLocalCartItem: (state, action) => {
      const { productId, size, qty } = action.payload;
      const item = state.items.find(
        (i) => i.productId === productId && i.size === size
      );
      if (!item) return;
      if (qty <= 0) {
        state.items = state.items.filter(
          (i) => !(i.productId === productId && i.size === size)
        );
      } else {
        item.qty = qty;
      }
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    // guest remove
    removeFromLocalCart: (state, action) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      );
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    // guest clear
    clearLocalCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_KEY);
    },
    // optional: clear server cart on logout
    clearServerCartState: (state) => {
      state.serverCart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchServerCart
      .addCase(fetchServerCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        state.loading = false;
        state.serverCart = action.payload;
      })
      .addCase(fetchServerCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addToServerCart
      .addCase(addToServerCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToServerCart.fulfilled, (state, action) => {
        state.loading = false;
        state.serverCart = action.payload;
      })
      .addCase(addToServerCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateServerCartItem
      .addCase(updateServerCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServerCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.serverCart = action.payload;
      })
      .addCase(updateServerCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeFromServerCart
      .addCase(removeFromServerCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromServerCart.fulfilled, (state, action) => {
        state.loading = false;
        state.serverCart = action.payload;
      })
      .addCase(removeFromServerCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // mergeCartWithServer
      .addCase(mergeCartWithServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCartWithServer.fulfilled, (state, action) => {
        state.loading = false;
        state.serverCart = action.payload;
        state.items = [];
        localStorage.removeItem(CART_KEY);
      })
      .addCase(mergeCartWithServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToLocalCart,
  updateLocalCartItem,
  removeFromLocalCart,
  clearLocalCart,
  clearServerCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
