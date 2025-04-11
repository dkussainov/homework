export const typeDefs = `
  scalar Date

  type User {
    id: ID
    name: String
    email: String
    role: String
    status: String
    birthdate: Date
  }

  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      role: String!
      status: String!
      birthdate: Date!
    ): User

    updateUser(
      id: ID!
      name: String!
      email: String!
      role: String!
      status: String!
      birthdate: Date!
    ): User

    deleteUser(id: ID!): User
  }
`;
