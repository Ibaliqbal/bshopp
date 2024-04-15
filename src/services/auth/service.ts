import { retrieveDataByField, setData } from "@/lib/firebase/services";
import bcrypt from "bcrypt";
import { FieldValue, serverTimestamp, where } from "firebase/firestore";

export async function signIn(userdata: { email: string }) {
  const data = await retrieveDataByField("users", [
    where("email", "==", userdata.email),
  ]);

  if (data) {
    return data[0];
  } else {
    return null;
  }
}

export async function singUp(
  userdata: {
    fullname: string;
    email: string;
    password: string;
    role: string;
    type: string;
    createdAt: FieldValue;
    updatedAt: FieldValue;
    photo_profile: string;
  },
  callback: Function
) {
  const data = await retrieveDataByField("users", [
    where("email", "==", userdata.email),
  ]);

  if (data.length > 0) {
    callback({ status: false, message: "Email has been used" });
  } else {
    if (userdata.password !== undefined) {
      const datauser = {
        fullname: userdata.fullname,
        email: userdata.email,
        photo_profile: "",
        type: "credentials",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: "member",
        password: await bcrypt.hash(userdata.password, 10),
      };

      await setData("users", datauser, (result: boolean) => {
        if (result) {
          callback({ status: result, message: "Register succsssfully" });
        } else {
          callback({ status: result, message: "Register failled" });
        }
      });
    }
  }
}

export async function loginWithGoogle(
  data: {
    fullname: any;
    email: any;
    photo_profile: any;
    type: string;
    createdAt: FieldValue;
    updatedAt: FieldValue;
    role?: string;
  },
  callback: Function
) {
  const user = await retrieveDataByField("users", [
    where("email", "==", data.email),
  ]);

  if (user.length > 0) {
    callback(user[0]);
  } else {
    data.role = "member";
    await setData("users", data, (result: boolean) => {
      if (result) callback(data);
    });
  }
}
