import { fetchDocuments } from "@/api/document";
import { useQuery } from "@tanstack/react-query";

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });
};
