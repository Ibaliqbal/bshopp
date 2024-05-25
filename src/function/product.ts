import { commentServices } from "@/services/comments";
import { productsServices } from "@/services/products";
import { Comments, Product } from "@/types/product";

class ProductFn {
  async fetchData(id: string) {
    const [product, comments] = await Promise.all([
      productsServices.detail(id),
      commentServices.getByProduct(id),
    ]);

    return { product: product.data.payload, comments: comments.data.payload };
  }

  sumFavorties(data: Array<Product>) {
    const sum = data.reduce(
      (
        acc: Array<{
          id: string;
          name: string;
          total: number;
          variant: string;
        }>,
        curr
      ) => {
        if (curr) {
          const findProduct = acc?.find(
            (product) =>
              product?.id === curr?.id &&
              product.variant === curr.categories?.label
          );

          if (findProduct) {
            findProduct.total++;
          } else {
            acc.push({
              id: curr?.id,
              name: curr.name_product,
              total: 1,
              variant: curr.categories?.label as string,
            });
          }
          return acc;
        } else {
          return [];
        }
      },
      []
    );

    return sum;
  }
}

const productFn = new ProductFn();

export default productFn;

export async function fetchData(id: string) {
  const [product, comments] = await Promise.all([
    productsServices.detail(id),
    commentServices.getByProduct(id),
  ]);

  const totalRating =
    comments.data.payload.length > 0
      ? comments.data.payload.reduce(
          (acc: number, curr: Comments) => acc + curr.rating,
          0
        ) / comments.data.payload.length
      : 0;

  return {
    product: product.data.payload,
    comments: comments.data.payload,
    totalRating,
  };
}

export function sumFavorties(data: Array<Product>) {
  const sum = data.reduce(
    (
      acc: Array<{ id: string; name: string; total: number; variant: string }>,
      curr
    ) => {
      if (curr) {
        const findProduct = acc?.find(
          (product) =>
            product?.id === curr?.id &&
            product.variant === curr.categories?.label
        );

        if (findProduct) {
          findProduct.total++;
        } else {
          acc.push({
            id: curr?.id,
            name: curr.name_product,
            total: 1,
            variant: curr.categories?.label as string,
          });
        }
        return acc;
      } else {
        return [];
      }
    },
    []
  );

  return sum;
}
