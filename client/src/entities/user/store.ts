import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "banned" | "pending";
  birthdate: string;
};

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  editUser: (updatedUser: User) => void;
  removeUser: (userId: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  editUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));
