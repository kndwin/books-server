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
        // if the kids rotate and can't figure out how, might need to
        // use Google's auth api
        // https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
        var jwksClient = require("jwks-rsa");
        var client = jwksClient({
          jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
        });
        const decoded = jwt.decode(token, { complete: true });
        const kid = decoded?.header.kid;
        const key = await client.getSigningKey(kid);
        const signingKey = key.getPublicKey();
        const verified = jwt.verify(token, signingKey); // verify JWT token
        // @ts-ignore
        return prisma.user.findFirst({ where: { email: verified.email } });
      } catch (err) {
        return err;
      }
    },
  },
};
