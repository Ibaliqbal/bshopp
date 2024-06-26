import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { updateCheckout } from "@/services/checkout/service";
import { getOrderById, updateOrder } from "@/services/orders/service";
import { updateProduct } from "@/services/products/method";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/services";
import { OtherSpec } from "@/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = await req.body;
    const hash = crypto
      .createHash("sha512")
      .update(
        `${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
      )
      .digest("hex");

    if (data.signature_key !== hash) {
      return res.status(403).json({
        status: false,
        message: "Invalid Signature",
      });
    }

    let orderId = data.order_id;
    let transactionStatus = data.transaction_status;
    let fraudStatus = data.fraud_status;
    let order: any;

    await getOrderById(orderId, (result: { status: boolean; data: any }) => {
      if (result.status) {
        order = result.data;
      } else {
        order = undefined;
      }
    });

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        const updateProducts = order?.cart.map(async (cart: any) => {
          const product = await getDoc(doc(firestore, "products", cart.id));
          if (product.exists()) {
            const findIndexSpec = product
              .data()
              .other_specs.findIndex(
                (spec: OtherSpec) => spec.size === cart.variant
              );
            await updateProduct(
              product.id,
              {
                other_specs: product.data().other_specs.with(findIndexSpec, {
                  soldout:
                    product.data().other_specs[findIndexSpec].soldout +
                    Number(cart?.qty),
                  stock:
                    product.data().other_specs[findIndexSpec].stock -
                    Number(cart?.qty),
                  ...product.data().other_specs[findIndexSpec],
                }),
                soldout: product.data().soldout + Number(cart?.qty),
              },
              () => {}
            );
          }
        });
        await Promise.all([
          updateCheckout(
            orderId,
            {
              status: "PAID",
            },
            () => {}
          ),
          updateOrder(
            orderId,
            {
              status: "PAID",
            },
            () => {}
          ),
          updateProducts,
        ]);

        return res.status(200).json({ status: true, message: "OK" });
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      const updateProducts = order?.cart.map(async (cart: any) => {
        const product = await getDoc(doc(firestore, "products", cart.id));
        if (product.exists()) {
          const findIndexSpec = product
            .data()
            .other_specs.findIndex(
              (spec: OtherSpec) => spec.size === cart.variant
            );
          await updateProduct(
            product.id,
            {
              other_specs: product.data().other_specs.with(findIndexSpec, {
                ...product.data().other_specs[findIndexSpec],
                stock:
                  product.data().other_specs[findIndexSpec].stock -
                  Number(cart?.qty),
                soldout:
                  product.data().other_specs[findIndexSpec].soldout +
                  Number(cart?.qty),
              }),
              soldout: product.data().soldout + Number(cart?.qty),
            },
            () => {}
          );
        }
      });
      await Promise.all([
        updateCheckout(
          orderId,
          {
            status: "PAID",
          },
          () => {}
        ),
        updateOrder(
          orderId,
          {
            status: "PAID",
          },
          () => {}
        ),
        updateProducts,
      ]);

      return res.status(200).json({ status: true, message: "OK" });
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      await Promise.all([
        updateCheckout(
          orderId,
          {
            status: "CANCELED",
          },
          () => {}
        ),
        updateOrder(
          orderId,
          {
            status: "CANCELED",
          },
          () => {}
        ),
      ]);

      return res.status(200).json({ status: true, message: "OK" });
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      await Promise.all([
        updateCheckout(
          orderId,
          {
            status: "PENDING",
          },
          () => {}
        ),
        updateOrder(
          orderId,
          {
            status: "PENDING",
          },
          () => {}
        ),
      ]);

      return res.status(200).json({ status: true, message: "OK" });
    }
  } else {
    res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }
}
