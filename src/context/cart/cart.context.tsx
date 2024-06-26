import { Cart, User } from "@/types/user";
import * as React from "react";
import { useSession } from "next-auth/react";
import userService from "@/services/users";
import { toast } from "sonner";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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

export const CartContext = React.createContext<CartContextType>({
  data: [],
  handleAdd: (data: Cart) => Promise.resolve(),
  handleDelete: (data: string, variant: string) => Promise.resolve(),
  handleCheckout: (data: string, variant: string) => Promise.resolve(),
  handleCheckoutAll: () => Promise.resolve(),
  handleQuantity: (data: string, variant: string, type: "inc" | "dec") =>
    Promise.resolve(),
});

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [cartData, setCart] = React.useState<Cart[]>([]);
  const [userId, setUserId] = React.useState("");
  const { status, data } = useSession();
  const [role, setRole] = React.useState("member");

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(firestore, "users"),
        where("email", "==", data?.user?.email ?? "")
      ),
      (snaphsot) => {
        const findUsers = snaphsot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (findUsers) {
          const data = findUsers[0] as User;
          if (data) {
            setCart(data.cart);
            setUserId(data.id);
            setRole(data.role);
          }
        }
      }
    );
    return () => unsub();
  }, [data]);

  const handleAdd = async (data: Cart) => {
    if (!userId) return;
    if (status !== "authenticated") {
      toast.error("Please login first");
      return;
    } else {
      if (role !== "admin") {
        const findIndex = cartData?.findIndex(
          (product) =>
            product.id === data?.id && product.variant === data.variant
        );
        if (findIndex !== -1) {
          const findProduct = cartData.find(
            (p) => p.id === data?.id && p.variant === data?.variant
          );
          if (findProduct) {
            const update = {
              ...findProduct,
              quantity: findProduct.quantity + 1,
            };
            const newCart = cartData?.with(findIndex, update);
            const res = await userService.update(userId || "", {
              cart: newCart,
            });
            if (res.status === 200) {
              toast.success(res.data.message);
            } else {
              toast.error(res.data.message);
            }
          }
        } else {
          const res = await userService.update(userId || "", {
            cart: [...cartData, data],
          });
          if (res.status === 200) {
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        }
      } else {
        toast.error("Only user or member can interact for this feature !");
      }
    }
  };

  const handleDelete = async (id: string, variant: string) => {
    const findProduct = cartData?.findIndex(
      (p) => p.id === id && p.variant === variant
    );
    if (findProduct === -1) return;
    const res = await userService.update(userId || "", {
      cart: cartData?.filter((_, i) => i !== findProduct),
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleCheckoutAll = async () => {
    const res = await userService.update(userId || "", {
      cart: cartData.map((p) => ({
        ...p,
        checked: cartData?.every((p) => p.checked) ? !p.checked : true,
      })),
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleCheckout = async (id: string, variant: string) => {
    const findPorduct = cartData?.findIndex(
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

    const res = await userService.update(userId || "", {
      cart: newCart,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleQuantity = async (
    id: string,
    variant: string,
    type: "inc" | "dec"
  ) => {
    const findPorduct = cartData?.findIndex(
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
    const res = await userService.update(userId || "", {
      cart: newCart,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
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

  return cart.data;
};
