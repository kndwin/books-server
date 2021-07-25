export type BookInput = {
  id: string;
  title: string;
  authors: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  imageLink?: string;
  amount: number;
};

export type UserInput = {
  name: string;
  email: string;
  image: string;
};
