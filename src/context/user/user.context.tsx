import userService from "@/services/users";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import * as React from "react";

type UserT = {
  data: User | undefined;
};

export const UserContext = React.createContext<UserT | null>(null);

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [user, setUser] = React.useState<User>();
  const { data, status } = useSession();
  async function fetchUser() {
    const res = await userService.detailUser(data?.user?.email as string);
    const detail = res.data.payload;
    console.log(detail);
    setUser(detail);
  }
  React.useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  return (
    <UserContext.Provider value={{ data: user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = React.useContext(UserContext);

  return user?.data;
};
