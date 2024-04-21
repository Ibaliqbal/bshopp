import { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useUsers } from "../user/user.context";
import { toast } from "sonner";
import userService from "@/services/users";
import { User } from "@/types/user";

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
  const { data } = useSession();
  const users = useUsers();
  const [favoriteProduct, setFavorite] = React.useState<Product[]>([]);
  const findUser = users?.find((user) => user.email === data?.user?.email);

  async function detail() {
    if (findUser) {
      const res = await userService.detailUser(findUser.id);
      const data = res.data.payload as User;
      setFavorite(data.favorite);
    }
  }

  React.useEffect(() => {
    if (findUser) {
      detail();
    }
  }, [users]);

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
      await userService.updateUser(findUser?.id ?? "", update);
      detail();
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
