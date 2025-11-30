import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  currentProduct: null,
};

// GET /api/products with filters + pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

// GET /api/products/:id
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load product"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // detail
      .addCase(fetchProductById.pending, (state) => {
        state.currentProduct = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage } = productsSlice.actions;
export default productsSlice.reducer;
