import { Timestamp } from "firebase/firestore";

export type TComment = {
  name: string;
  id: string;
  product_id: string;
  comment_at: Timestamp;
  text: string;
  rating: number;
  photo_profile: string;
};
