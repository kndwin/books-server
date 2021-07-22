export type BookInput = {
  id: string;
  title: string;
  author: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  imageLink?: string;
  amount: number;
};
