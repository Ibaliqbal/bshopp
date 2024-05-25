import { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import * as React from "react";
import { toast } from "sonner";
import userService from "@/services/users";
import { User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase/services";
import { productsServices } from "@/services/products";

type FavoriteContextType = {
  favorite: Product[];
  handleFav: (data: Product) => Promise<void>;
};

export const FavoriteContext = React.createContext<FavoriteContextType>({
  favorite: [],
  handleFav: (data: Product) => new Promise((resolver) => resolver),
});

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { data, status } = useSession();
  const [favoriteProduct, setFavorite] = React.useState<Product[]>([]);
  const [userId, setUserId] = React.useState("");
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
            setFavorite(data.favorite);
            setUserId(data.id);
            setRole(data.role);
          }
        }
      }
    );
    return () => unsub();
  }, [data]);

  const handleFav = async (dataProduct: Product) => {
    if (!userId) return;
    if (status !== "authenticated") {
      toast.error("Please login first");
    } else {
      if (role !== "admin") {
        const findProduct = favoriteProduct?.filter(
          (product) => product.id === dataProduct.id
        );
        const update = {
          favorite:
            findProduct?.length > 0
              ? favoriteProduct?.filter(
                  (product) => product.id !== findProduct[0]?.id
                )
              : [...favoriteProduct, dataProduct],
        };
        await userService.update(userId, update);
      } else {
        toast.error("Only user or member can interact for this feature !");
      }
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorite: favoriteProduct, handleFav }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const fav = React.useContext(FavoriteContext);

  return fav?.favorite as Product[];
};
