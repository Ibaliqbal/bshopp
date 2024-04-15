import instance from "@/lib/axios/instance";
import { TCreatedProduct } from "@/types/product";
import { OrderByDirection } from "firebase/firestore";

export const productsServices = {
  getProducts: () => instance.get("/api/products"),
  createProduct: (data: TCreatedProduct) =>
    instance.post("/api/products", data),
  detailProduct: (id: string) => instance.get(`/api/products/${id}`),
  deleteProduct: (id: string) => instance.delete(`/api/products/${id}`),
  getProductsPaginations: (start: number, limit: number) =>
    instance.get(`/api/products?_start=${start}&_limit=${limit}`),
  getProductsSearchAndPagination: (
    params: string,
    limit: number,
    start: number
  ) =>
    instance.get(
      `/api/products/search?q=${params}&_limit=${limit}&_start=${start}`
    ),
  getProductsPaginitionsWithSorted: (
    start: number,
    limit: number,
    sort: "desc" | "asc"
  ) =>
    instance.get(`/api/products?_start=${start}&_limit=${limit}&_sort=${sort}`),
  getSearchProducts: (params: string) =>
    instance.get(`/api/products/search?q=${params}`),
  getRecomendedProducts: (filter: string, sort: OrderByDirection) =>
    instance.get(`/api/products?_filter=${filter}`),
};
