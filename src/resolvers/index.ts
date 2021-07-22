import { PrismaClient } from "@prisma/client";
import { BookInput } from "../types";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    books: () => {
      return prisma.book.findMany();
    },
  },

  Mutation: {
    addBook: (_: ParentNode, { input }: { input: BookInput }) => {
      return prisma.book.create({ data: input });
    },
    deleteBook: (_: ParentNode, { id }: { id: string }) => {
      return prisma.book.delete({ where: { id } });
    },
    editBook: (_: ParentNode, { input }: { input: BookInput }) => {
      return prisma.book.update({
        where: { id: input.id },
        data: input,
      });
    },
  },
};
