import {
  deleteData,
  retrieveData,
  retrieveDataByField,
  retrieveDataDetail,
  updateData,
} from "@/lib/firebase/services";
import { where } from "firebase/firestore";

export async function getUsers() {
  const data = await retrieveData("users");
  if (data.length > 0) {
    return data;
  } else {
    return null;
  }
}

export async function detailUserByEmail(email: string) {
  const user = await retrieveDataByField("users", [
    where("email", "==", email),
  ]);

  return user[0];
}

export async function detailUser(id: string) {
  const user = await retrieveDataDetail("users", id);

  return user;
}

export async function deleteUser(id: string, callback: Function) {
  await deleteData("users", id, (res: boolean) => {
    if (!res) return callback({ status: res, message: "Wrong id user" });
    return callback({ status: res, message: "User deleted" });
  });
}

export async function updateUser(id: string, data: any, callback: Function) {
  await updateData("users", id, data, (res: boolean) => {
    if (res) {
      callback({ message: "Updated sueccessfuly", status: res });
    } else {
      callback({ message: "Updated failed", status: res });
    }
  });
}
