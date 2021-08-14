import { gql } from "apollo-server";
import { UserInput } from "types";
import { prisma } from "../../lib/prisma";

enum UserRole {
  "USER",
  "ADMIN",
}

interface UserInputWithRole extends UserInput {
  role: UserRole;
}

const sharedUserFields = `
    name: String
    email: String
    image: String
    role: UserRole
`;
export const typeDefs = gql`
	enum UserRole {
		USER
		ADMIN
	}
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
		usersWith(user: UserInput): [User]
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
    usersWith: async (_: ParentNode, { user }: any) => {
      const { email, name, image, role } = user;
      return prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: email } },
            { name: { contains: name } },
            { image: { contains: image } },
            // @ts-ignore
            { role: { in: [role] } },
          ],
        },
      });
    },
  },
  Mutation: {
    updateUser: async (
      _: ParentNode,
      { id, user }: { id: string; user: UserInput }
    ) => {
      console.log({ id, user });
      const userFound = await prisma.user.update({
        where: { id },
        data: user,
      });
      console.log({ userFound });
      return userFound;
    },
  },
};
