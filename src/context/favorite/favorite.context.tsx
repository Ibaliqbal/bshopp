import { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import * as React from "react";
import { toast } from "sonner";
import userService from "@/services/users";
import { User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase/services";

type FavoriteContextType = {
  favorite: Product[];
  handleFav: (data: Product) => Promise<void>;
};

export const FavoriteContext = React.createContext<FavoriteContextType | null>(
  null
);

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { data, status } = useSession();
  const [favoriteProduct, setFavorite] = React.useState<Product[]>([]);
  const [userId, setUserId] = React.useState("");

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
          setFavorite(data?.favorite);
          setUserId(data?.id);
        }
      }
    );
    return () => unsub();
  }, [data]);

  const handleFav = async (data: Product) => {
    if (!userId) return;
    if (status !== "authenticated") {
      toast.error("Please login first");
    } else {
      const findProduct = favoriteProduct.filter(
        (product) => product.id === data.id
      );
      const update = {
        favorite:
          findProduct.length > 0
            ? favoriteProduct?.filter((product) => product.id !== data.id)
            : [...favoriteProduct, data],
      };
      await userService.update(userId, update);
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
