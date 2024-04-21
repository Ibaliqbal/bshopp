import { Cart, User } from "@/types/user";
import * as React from "react";
import { useUsers } from "../user/user.context";
import { useSession } from "next-auth/react";
import userService from "@/services/users";
import { toast } from "sonner";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase/services";

type CartContextType = {
  data: Cart[];
  handleAdd: (data: Cart) => Promise<void>;
  handleDelete: (data: string, variant: string) => Promise<void>;
  handleCheckout: (data: string, variant: string) => Promise<void>;
  handleCheckoutAll: () => Promise<void>;
  handleQuantity: (
    data: string,
    variant: string,
    type: "inc" | "dec"
  ) => Promise<void>;
};

export const CartContext = React.createContext<CartContextType | null>(null);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [cartData, setCart] = React.useState<Cart[]>([]);
  const { status, data } = useSession();

  const users = useUsers();

  const findUser = users?.find((user) => user.email === data?.user?.email);

  async function detail() {
    if (findUser) {
      const res = await userService.detailUser(findUser.id);
      const data = res.data.payload as User;
      setCart(data.cart);
    }
  }

  // React.useEffect(() => {
  //   if (findUser) {
  //     detail();
  //   }
  // }, [users]);

  React.useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "users", findUser?.id ?? ""),
      (snaphsot) => {
        if (snaphsot.exists()) {
          setCart(snaphsot.data().cart);
        }
      }
    );

    return () => unsub();
  }, [users]);

  const handleAdd = async (data: Cart) => {
    if (!findUser?.id) return;
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
          // detail();
        } else {
          toast.error(res.data.message);
          // detail();
        }
      } else {
        const res = await userService.updateUser(findUser?.id ?? "", {
          cart: [...cartData, data],
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          // detail();
        } else {
          toast.error(res.data.message);
          // detail();
        }
      }
    }
  };

  const handleDelete = async (id: string, variant: string) => {
    const findProduct = cartData.findIndex(
      (p) => p.id === id && p.variant === variant
    );
    if (findProduct === -1) return;
    const res = await userService.updateUser(findUser?.id ?? "", {
      cart: cartData.filter((_, i) => i !== findProduct),
    });
    if (res.status === 200) {
      toast.success(res.data.message);
      // detail();
    } else {
      toast.error(res.data.message);
      // detail();
    }
  };

  const handleCheckoutAll = async () => {
    const res = await userService.updateUser(findUser?.id ?? "", {
      cart: cartData.map((p) => ({
        ...p,
        checked: cartData.every((p) => p.checked) ? !p.checked : true,
      })),
    });
    if (res.status === 200) {
      toast.success(res.data.message);
      // detail();
    } else {
      toast.error(res.data.message);
      // detail();
    }
  };

  const handleCheckout = async (id: string, variant: string) => {
    const findPorduct = cartData.findIndex(
      (p) => p.id === id && p.variant === variant
    );
    if (findPorduct === -1) return;
    const newCart = cartData.map((p, i) => {
      if (i === findPorduct) {
        return {
          ...p,
          checked: !p.checked,
        };
      } else {
        return p;
      }
    });

    const res = await userService.updateUser(findUser?.id ?? "", {
      cart: newCart,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
      // detail();
    } else {
      toast.error(res.data.message);
      // detail();
    }
  };

  const handleQuantity = async (
    id: string,
    variant: string,
    type: "inc" | "dec"
  ) => {
    const findPorduct = cartData.findIndex(
      (p) => p.id === id && p.variant === variant
    );
    if (findPorduct === -1) return;
    const newCart = cartData.map((p, i) => {
      if (i === findPorduct) {
        return {
          ...p,
          quantity:
            type === "inc"
              ? p.quantity + 1
              : p.quantity === 1
              ? p.quantity
              : p.quantity - 1,
        };
      } else {
        return p;
      }
    });
    const res = await userService.updateUser(findUser?.id ?? "", {
      cart: newCart,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
      // detail();
    } else {
      toast.error(res.data.message);
      // detail();
    }
  };
  return (
    <CartContext.Provider
      value={{
        data: cartData,
        handleAdd,
        handleCheckout,
        handleDelete,
        handleQuantity,
        handleCheckoutAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const cart = React.useContext(CartContext);

  return cart?.data;
};
