import merge from "lodash.merge";
import { gql } from "apollo-server";

import { typeDefs as bookTypeDefs, resolvers as bookResolvers } from "./books";
import { typeDefs as userTypeDefs, resolvers as userResolvers } from "./users";

// Need to make at least one instance of "type Query" to allow other typeDefs to extend
// https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/#extending-types-in-multiple-files
const rootTypeDef = gql`
  type Query {
    _empty: String
  }
`;

export const typeDefs = [rootTypeDef, bookTypeDefs, userTypeDefs];
export const resolvers = merge(bookResolvers, userResolvers);
