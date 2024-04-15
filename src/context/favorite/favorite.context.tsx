import { firestore } from "@/lib/firebase/services";
import { Product } from "@/types/product";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useUser } from "../user/user.context";
import { User } from "@/types/user";
import { toast } from "sonner";
import userService from "@/services/users";

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
  const { status } = useSession();
  const [favoriteProduct, setFavorite] = React.useState<Product[]>([]);
  const user = useUser();
  const email = user?.email ?? "";

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(firestore, "users"), where("email", "==", email)),
      (snapshot) => {
        const data = snapshot.docs[0]?.data() as User;
        setFavorite(data?.favorite ?? []);
      }
    );

    return () => unsub();
  }, [email]);

  const handleFav = async (data: Product) => {
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
      await userService.updateUser(user?.id ?? "", update);
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

  return fav?.favorite;
};
