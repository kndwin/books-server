import { gql } from "apollo-server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { OAuth2Client } from "google-auth-library";
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
        const client = new OAuth2Client(
          "682101596809-2a0n5asmn8vmk3md35r3v8vbfeb4th0k.apps.googleusercontent.com"
        );
        async function verify() {
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience:
              "682101596809-2a0n5asmn8vmk3md35r3v8vbfeb4th0k.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
          });
          const payload = ticket.getPayload();
          const userid = payload?.sub;
          console.log({ userid });
          // If request specified a G Suite domain:
          // const domain = payload['hd'];
        }
        verify().catch(console.error);

        /*
        // get google's public key
        //        const publicKey = await res.json();
        //        console.log(publicKey.keys[0]);
        var jwksClient = require("jwks-rsa");
        var client = jwksClient({
          jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
        });
        const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
        const header = res.headers;
        console.log({ header });
        const json = await res.json();
        const kid = json.keys[1].kid;
        const key = await client.getSigningKey(kid);
        const signingKey = key.getPublicKey();

        const verified = jwt.verify(token, signingKey); // verify JWT token
        // @ts-ignore
				*/
        return prisma.user.findFirst({ where: { email: "test" } });
      } catch (err) {
        return err;
      }
    },
  },
};
