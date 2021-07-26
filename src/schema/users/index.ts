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
        //        const publicKey = await res.json();
        //        console.log(publicKey.keys[0]);
        var jwksClient = require("jwks-rsa");
        var client = jwksClient({
          jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
        });
        const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
        const json = await res.json();
        const kid = json.keys[1].kid;
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
