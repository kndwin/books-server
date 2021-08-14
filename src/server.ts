import { ApolloServer, AuthenticationError } from "apollo-server";
import { typeDefs, resolvers } from "./schema";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { prisma } from "./lib/prisma";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*", // TODO: restrict to only from Nextjs server
  },
  context: async ({ req }) => {
    if (process.env.NODE_ENV === "development") {
      // if dev, turn off auth for ease of development
    } else {
      const token = req.headers.authorization as string;
      var client = jwksClient({
        jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
      });
      const decoded = jwt.decode(token, { complete: true });
      const kid = decoded?.header.kid;
      const key = await client.getSigningKey(kid);
      const signingKey = key.getPublicKey();
      const verified = jwt.verify(token, signingKey);
      const authorizedUser = prisma.user.findFirst({
        // @ts-ignore
        where: { email: verified.email },
      });
      if (!authorizedUser) {
        throw new AuthenticationError("You must be signed in");
      }
      return {
        authorizedUser,
      };
    }
  },
});

const startServer = async () => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 Server ready at ${url}`);
};

startServer();
