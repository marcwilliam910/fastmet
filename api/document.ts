import api from "@/lib/axios";

type DocumentResponse = {
  idImage: string;
  selfieWithId: string;
};

export const fetchDocuments = async (): Promise<DocumentResponse> => {
  const res = await api.get("/documents");
  return res.data.images;
};
