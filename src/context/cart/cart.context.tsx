import { Cart, User } from "@/types/user";
import * as React from "react";
import { useUsers } from "../user/user.context";
import { useSession } from "next-auth/react";
import userService from "@/services/users";
import { toast } from "sonner";

type CartContextType = {
  data: Cart[];
  handleAdd: (data: Cart) => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CartContext = React.createContext<CartContextType | null>(null);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [cartData, setCart] = React.useState<Cart[]>([]);
  const { status, data } = useSession();
  const [open, setOpen] = React.useState(false);

  const users = useUsers();

  const findUser = users?.find((user) => user.email === data?.user?.email);

  async function detail() {
    if (findUser) {
      const res = await userService.detailUser(findUser.id);
      const data = res.data.payload as User;
      console.log(data.cart);
      setCart(data.cart);
    }
  }

  React.useEffect(() => {
    console.log(users);
    console.log(findUser);
    if (findUser) {
      detail();
    }
  }, [users]);

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
        const res = await userService.updateUser(findUser?.id ?? "", {
          cart: cartData,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          detail();
        } else {
          toast.error(res.data.message);
          detail();
        }
      } else {
        const res = await userService.updateUser(findUser?.id ?? "", {
          cart: [...cartData, data],
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          detail();
        } else {
          toast.error(res.data.message);
          detail();
        }
      }
    }
  };
  return (
    <CartContext.Provider value={{ data: cartData, handleAdd, setOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const cart = React.useContext(CartContext);

  return cart?.data;
};
