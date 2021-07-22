import { gql } from "apollo-server";

const shareBookFields = `# gql
	title: String
	author: String
	description: String
	publisher: String
	publishedDate: String
	pageCount: Int
	imageLink: String
	amount: Int
`;
export const typeDefs = gql`
  type Book {
    id: String
		${shareBookFields}
  }

  input BookInput {
		${shareBookFields}
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(input: BookInput): Book
    deleteBook(id: String!): Book
    editBook(input: BookInput): Book
  }
`;
