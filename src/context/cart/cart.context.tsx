import { firestore } from "@/lib/firebase/services";
import { Cart, User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import * as React from "react";
import { useUser } from "../user/user.context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import userService from "@/services/users";

type CartContextType = {
  data: Cart[];
  handleAdd: (data: Cart) => Promise<void>;
};

export const CartContext = React.createContext<CartContextType | null>(null);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [cartData, setCart] = React.useState<Cart[]>([]);
  const { status } = useSession();

  const user = useUser() as User;
  const email = user?.email ?? "";
  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(firestore, "users"), where("email", "==", email)),
      (snapshot) => {
        const data = snapshot.docs[0]?.data() as User;
        setCart(data?.cart ?? []);
      }
    );

    return () => unsub();
  }, [email]);

  const handleAdd = async (data: Cart) => {
    if (status !== "authenticated") {
      toast.error("Please login first");
      return;
    } else {
      const findIndex = cartData?.findIndex(
        (product) => product.id === data.id && product.variant === data.variant
      );
      if (findIndex !== -1) {
        const findProduct = cartData[findIndex];
        const update = {
          ...findProduct,
          quantity: findProduct.quantity + 1,
        };
        cartData[findIndex] = update;
        const res = await userService.updateUser(user.id ?? "", {
          cart: cartData,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await userService.updateUser(user.id ?? "", {
          cart: [...cartData, data],
        });
        if (res.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      }
    }
  };
  return (
    <CartContext.Provider value={{ data: cartData, handleAdd }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const cart = React.useContext(CartContext);

  return cart?.data;
};
