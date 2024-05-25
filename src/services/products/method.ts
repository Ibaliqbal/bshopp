import {
  deleteData,
  detailData,
  retrieveData,
  retrieveDataByField,
  retrievePaginationData,
  setData,
  updateData,
} from "@/lib/firebase/services";
import { Product, TCreatedProduct } from "@/types/product";
import { orderBy, startAfter, where } from "firebase/firestore";

export async function getProducts() {
  const data = await retrieveData("products");
  if (data.length > 0) {
    return data;
  } else {
    return null;
  }
}

export async function detailProduct(id: string, callback: Function) {
  await detailData(
    "products",
    id,
    (response: { status: boolean; data: Product }) => {
      if (response.status)
        callback({ status: response.status, data: response.data });
      else callback({ status: response.status, data: response.data });
    }
  );
}

export async function createProduct(data: TCreatedProduct, callback: Function) {
  await setData("products", data, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id product" });
    return callback({ status: res, message: "Product created" });
  });
}

export async function deleteProduct(id: string, callback: Function) {
  await deleteData("products", id, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id product" });
    return callback({ status: res, message: "Product deleted" });
  });
}

export async function paginationProdcuts(
  lastData: any,
  queryLimit: number,
  loadMore: boolean
) {
  const pagination = loadMore ? [startAfter(lastData.createdAt)] : [];
  const products = await retrievePaginationData(
    "products",
    [orderBy("createdAt"), ...pagination],
    queryLimit
  );

  return products;
}

export async function searchProducts(params: string) {
  const data = await retrieveDataByField("products", [
    where("name_product", "<=", params + "\uf8ff"),
    where("name_product", ">=", params),
  ]);

  return data;
}

export async function filterCateProducts(filter: number) {
  const products = await retrieveDataByField("products", [
    where("categories.value", "==", filter),
  ]);

  return products;
}

export async function searchAndPaginateProducts(
  paramsSearch: string,
  limitData: number,
  lastData: any,
  loadMore: boolean
) {
  const pagination = loadMore ? [startAfter(lastData.name_product)] : [];
  const products = await retrievePaginationData(
    "products",
    [
      where("name_product", "<=", paramsSearch + "\uf8ff"),
      where("name_product", ">=", paramsSearch),
      orderBy("name_product"),
      ...pagination,
    ],
    limitData
  );

  return products;
}

export async function updateProduct(id: string, data: any, callback: Function) {
  await updateData("products", id, data, (result: boolean) => {
    if (!result) callback({ status: result, message: "Wrong id product" });
    return callback({ status: result, message: "Product updated" });
  });
}
