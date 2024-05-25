import { retrieveDataByField, setData } from "@/lib/firebase/services";
import { Comments } from "@/types/product";
import { where } from "firebase/firestore";

export async function createComments(data: Comments, callback: Function) {
  await setData("comments", data, (res: boolean) => {
    if (res) callback({ status: res, message: "Comment successfully posted" });
    callback({ status: res, message: "Comment failed posted" });
  });
}

export async function getCommentByProduct(id: string) {
  const data = await retrieveDataByField("comments", [
    where("product_id", "==", id),
  ]);

  if (data) {
    return data;
  } else {
    return null;
  }
}
