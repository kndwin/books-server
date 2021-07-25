import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*", // TODO: restrict to only from Nextjs server
  },
  context: ({ req }) => {
    const auth = req.headers.authorization || "";
    return { auth };
  },
});

const startServer = async () => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 Server ready at ${url}`);
};

startServer();
