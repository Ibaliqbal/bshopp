import { retrieveDataByField, sortedData } from "@/lib/firebase/services";
import {
  createProduct,
  deleteProduct,
  detailProduct,
  filterCateProducts,
  getProducts,
  paginationProdcuts,
  searchAndPaginateProducts,
  searchProducts,
} from "@/services/products/method";
import { Product } from "@/types/product";
import { OrderByDirection, serverTimestamp, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  message: string;
  payload?: any;
  count?: number;
  total?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const queryProduct = req.query.products;
    const querySearch = req.query.q;
    const queryLimit = req.query._limit;
    const queryStart = req.query._start;
    const querySort = req.query._sort;
    const queryFilter = req.query._filter;

    if (!queryProduct) {
      if (queryStart && queryLimit) {
        const datas = await sortedData("products", "createdAt", "desc");
        if (datas.length < 0)
          return res.status(200).json({ status: false, message: "gagal 100" });
        if (parseInt(queryStart[0]) > 1) {
          const lastData = datas[
            (parseInt(queryStart[0]) - 1) * parseInt(queryLimit[0]) - 1
          ] as Product;

          const products = await paginationProdcuts(
            lastData,
            parseInt(queryLimit[0]),
            true
          );

          if (products.data) {
            return res.status(200).json({
              status: true,
              message: "Successfully guys",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          } else {
            return res.status(404).json({
              status: false,
              message: "Failed",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          }
        } else {
          const products = await paginationProdcuts(
            {},
            parseInt(queryLimit[0]),
            false
          );

          if (products.data) {
            return res.status(200).json({
              status: true,
              message: "Successfully nice",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          } else {
            return res.status(200).json({
              status: false,
              message: "Failed",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          }
        }
      } else {
        if (queryFilter) {
          const datas = await filterCateProducts(
            parseInt(queryFilter as string)
          );
          if (datas) {
            return res
              .status(200)
              .json({ status: true, message: "Successfully", payload: datas });
          } else {
            return res
              .status(404)
              .json({ status: false, message: "Failed", payload: datas });
          }
        }
        const products = await getProducts();
        if (products) {
          return res.status(200).json({
            status: true,
            message: "Successfully",
            payload: products,
          });
        } else {
          return res
            .status(200)
            .json({ status: false, message: "Failed", payload: products });
        }
      }
    } else if (queryProduct![0] === "search") {
      // if (!queryLimit || !queryStart || !querySearch)
      //   return res
      //     .status(400)
      //     .json({ status: true, message: "Invalid query params" });
      const paramsSearch = querySearch as string;
      if (queryLimit && queryStart) {
        const datas = await retrieveDataByField("products", [
          where("name_product", "<=", paramsSearch + "\uf8ff"),
          where("name_product", ">=", paramsSearch),
        ]);
        if (!datas)
          return res.status(200).json({ status: false, message: "gagal 100" });
        const lastData: any =
          datas[(parseInt(queryStart![0]) - 1) * parseInt(queryLimit![0]) - 1];
        if (parseInt(queryStart![0]) > 1) {
          const products = await searchAndPaginateProducts(
            paramsSearch,
            parseInt(queryLimit![0]),
            lastData,
            true
          );
          if (products.data) {
            return res.status(200).json({
              status: true,
              message: "Successfully hah ?",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          } else {
            return res.status(200).json({
              status: false,
              message: "Failed",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          }
        } else {
          const products = await searchAndPaginateProducts(
            paramsSearch,
            parseInt(queryLimit![0]),
            "",
            false
          );
          if (products.data) {
            return res.status(200).json({
              status: true,
              message: "Successfully ges",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          } else {
            return res.status(200).json({
              status: false,
              message: "Failed",
              payload: products.data,
              count: products.totalCount,
              total: products.total,
            });
          }
        }
      }

      const products = await searchProducts(paramsSearch);
      if (products) {
        return res.status(200).json({
          status: true,
          message: "Successfully",
          payload: products,
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Failed", payload: products });
      }

      // return res.status(200).json({ status: true, message: "Berhasil cuy" });
      // if (querySort && querySearch)
      //   !querySearch
      //     ? res.status(200).json({ status: true, message: "Berhasil cuy" })
      //     : res.status(400).json({ status: true, message: "Sorted search" });
    } else {
      await detailProduct(
        queryProduct![0],
        (result: { status: boolean; data: any }) => {
          if (result.status) {
            return res.status(200).json({
              status: result.status,
              message: "Successfully to get data",
              payload: result.data,
            });
          } else {
            return res.status(400).json({
              status: result.status,
              message: "Data not found",
              payload: result.data,
            });
          }
        }
      );
    }
  } else if (req.method === "POST") {
    const data = req.body;
    data.createdAt = serverTimestamp();
    data.updatedAt = serverTimestamp();
    await createProduct(
      data,
      (response: { status: boolean; message: string }) => {
        if (response.status) {
          res.status(201).json({
            status: response.status,
            message: response.message,
          });
        } else {
          res.status(400).json({
            status: response.status,
            message: response.message,
          });
        }
      }
    );
  } else if (req.method === "DELETE") {
    const id = req.query.products;
    if (id) {
      await deleteProduct(
        id[0],
        (response: { status: boolean; message: string }) => {
          if (!response.status)
            res
              .status(400)
              .json({ status: response.status, message: response.message });

          res
            .status(200)
            .json({ status: response.status, message: response.message });
        }
      );
    }
  } else {
    res.status(403).json({ status: false, message: "Method not allowed" });
  }
}
