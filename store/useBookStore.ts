import { create } from "zustand";

interface BookState {}

export const useBookStore = create<BookState>((set) => ({}));
