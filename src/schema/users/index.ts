import { gql } from "apollo-server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
    image: String
    role: String
  }

  extend type Query {
    me(email: String): User
    authorize(token: String): User
    all: [User]
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
    authorize: async (_: ParentNode, { token }: { token: string }) => {
      try {
        // get google's public key
        const res = await fetch("https://www.googleapis.com/oauth2/v1/certs");
        const publicKey = await res.json();
        // verify JWT token
        const verified = jwt.verify(
          token,
          publicKey["7f548f6708690c21120b0ab668caa079acbc2b2f"],
          { algorithms: ["RS256"] }
        );
        // @ts-ignore
        const { email } = verified;
        return prisma.user.findFirst({ where: { email } });
      } catch (err) {
        return err;
      }
    },
  },
};
