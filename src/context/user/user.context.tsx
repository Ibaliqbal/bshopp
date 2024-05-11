import { firestore } from "@/lib/firebase/services";
import { User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";

type UserContextType = {
  user: User | any;
};

export const UserContext = React.createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [user, setUser] = React.useState<User | any>();
  const { data } = useSession();

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(firestore, "users"),
        where("email", "==", data?.user?.email ?? "")
      ),
      (snapshot) => {
        const findUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (findUsers) {
          const data = findUsers[0] as User;
          setUser(data);
        }
      }
    );
    return () => unsub();
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = React.useContext(UserContext);

  return user?.user;
};
