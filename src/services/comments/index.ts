import instance from "@/lib/axios/instance";
import { TComment } from "@/types/comment";

export const commentServices = {
  create: (data: Omit<TComment, "comment_at">) =>
    instance.post(`/api/comments`, data),
  getByProduct: (id: string) => instance.get(`/api/comments/${id}`),
};
