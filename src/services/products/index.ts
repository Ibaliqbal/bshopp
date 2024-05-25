import instance from "@/lib/axios/instance";
import { TCreatedProduct } from "@/types/product";

export const productsServices = {
  get: () => instance.get("/api/products"),
  create: (data: TCreatedProduct) => instance.post("/api/products", data),
  detail: (id: string) => instance.get(`/api/products/${id}`),
  delete: (id: string) => instance.delete(`/api/products/${id}`),
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
  search: (params: string) => instance.get(`/api/products/search?q=${params}`),
  recomended: (filter: string) =>
    instance.get(`/api/products?_filter=${filter}`),
  update: <TUpdate>(id: string, data: TUpdate) =>
    instance.put(`/api/products/${id}`, data),
};
