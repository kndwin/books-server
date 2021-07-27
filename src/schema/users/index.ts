import { gql } from "apollo-server";
import { UserInput } from "types";
import { prisma } from "../../lib/prisma";

const sharedUserFields = `
    name: String
    email: String
    image: String
    role: String
`;
export const typeDefs = gql`
	type User {
		id: String
		${sharedUserFields}
	}

	input UserInput {
		${sharedUserFields}
	}

	extend type Query {
		me(email: String): User
		all: [User]
  }

	extend type Mutation {
		updateUser(id: String!, user: UserInput): User
	}
`;

export const resolvers = {
  Query: {
    me: async (_: ParentNode, { email }: { email: string }, context: any) => {
      const user = await context.authorizedUser;
      console.log(user.email);
      return prisma.user.findFirst({ where: { email } });
    },
    all: () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    updateUser: async (
      _: ParentNode,
      { id, user }: { id: string; user: UserInput }
    ) => {
      return prisma.user.update({
        where: { id },
        data: user,
      });
    },
  },
};
