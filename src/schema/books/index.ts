import { gql } from "apollo-server";
import { prisma } from "../../lib/prisma";
import { BookInput } from "types";

const sharedBookFields = `# gql
	title: String
	authors: String
	description: String
	publisher: String
	publishedDate: String
	pageCount: Int
	imageLink: String
	amount: Int
	userId: String
`;

export const typeDefs = gql`
  type Book {
    id: String
		${sharedBookFields}
  }

  input BookInput {
		${sharedBookFields}
  }

  extend type Query {
    books: [Book]
		booksFrom(userId: String): [Book]
  }

  type Mutation {
    addBook(input: BookInput): Book
    deleteBook(id: String!): Book
    editBook(id: String!, input: BookInput): Book
  }
`;

export const resolvers = {
  Query: {
    books: () => {
      return prisma.book.findMany();
    },
    booksFrom: async (_: ParentNode, { userId }: { userId: string }) => {
      const booksFromUser = await prisma.book.findMany({ where: { userId } });
      console.log({ userId, booksFromUser });
      return booksFromUser;
    },
  },
  Mutation: {
    addBook: (_: ParentNode, { input }: { input: BookInput }) => {
      return prisma.book.create({ data: input });
    },
    deleteBook: (_: ParentNode, { id }: { id: string }) => {
      return prisma.book.delete({ where: { id } });
    },
    editBook: (
      _: ParentNode,
      { id, input }: { id: string; input: BookInput }
    ) => {
      return prisma.book.update({
        where: { id },
        data: input,
      });
    },
  },
};
