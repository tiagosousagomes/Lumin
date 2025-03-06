const { gql } = require('apollo-server');

// Definindo o Schema GraphQL
const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    bio: String
    profilePicture: String
  }

  type Query {
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, username: String!, bio: String, profilePicture: String): User!
    login(email: String!, password: String!): AuthPayload!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;
