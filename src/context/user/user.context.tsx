import userService from "@/services/users";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import * as React from "react";

type UserT = {
  users: User[];
};

export const UserContext = React.createContext<UserT>({
  users: [],
});

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  return (
    <UserContext.Provider value={{ users: users?.data.payload }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const user = React.useContext(UserContext);

  return user.users;
};
