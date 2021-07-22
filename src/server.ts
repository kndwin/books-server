import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*", // TODO: restrict to only from Nextjs server
  },
});

const startServer = async () => {
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 Server ready at ${url}`);
};

startServer();
