import { gql } from "apollo-server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { UserInput } from "types";

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
    authorize(token: String): User
		updateUser(id: String!, user: UserInput): User
	}
`;

export const resolvers = {
  Query: {
    me: (_: ParentNode, { email }: { email: string }) => {
      return prisma.user.findFirst({ where: { email } });
    },
    all: () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    authorize: async (_: ParentNode, { token }: { token: string }) => {
      // TODO: update apollo server context
      try {
        var client = jwksClient({
          jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
        });
        const decoded = jwt.decode(token, { complete: true });
        const kid = decoded?.header.kid;
        const key = await client.getSigningKey(kid);
        const signingKey = key.getPublicKey();
        const verified = jwt.verify(token, signingKey);
        // @ts-ignore
        return prisma.user.findFirst({ where: { email: verified.email } });
      } catch (err) {
        return err;
      }
    },
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
