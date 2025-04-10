import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLScalarType, Kind } from "graphql";

const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "admin",
    status: "active",
    birthdate: new Date("1990-05-14"),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "user",
    status: "pending",
    birthdate: new Date("1985-11-23"),
  },
  {
    id: "3",
    name: "Carol Martinez",
    email: "carol.martinez@example.com",
    role: "moderator",
    status: "active",
    birthdate: new Date("1992-07-09"),
  },
  {
    id: "4",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "user",
    status: "active",
    birthdate: new Date("1988-03-30"),
  },
  {
    id: "5",
    name: "Evelyn Wright",
    email: "evelyn.wright@example.com",
    role: "admin",
    status: "banned",
    birthdate: new Date("1995-12-18"),
  },
];

// GraphQL schema
const typeDefs = `
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

// Resolvers including custom Date scalar, create, edit, and delete mutations
const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Custom scalar for Date values",
    parseValue(value) {
      return new Date(value); // client -> server
    },
    serialize(value) {
      return value.toISOString(); // server -> client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  Query: {
    getUsers: () => users,
    getUserById: (parent, args) => {
      return users.find((user) => user.id === args.id);
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, email, role, status, birthdate } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        role,
        status,
        birthdate: new Date(birthdate),
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, args) => {
      const { id, name, email, role, status, birthdate } = args;
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Update the user data
      const updatedUser = {
        ...users[userIndex],
        name,
        email,
        role,
        status,
        birthdate: new Date(birthdate),
      };

      users[userIndex] = updatedUser;
      return updatedUser;
    },
    deleteUser: (parent, args) => {
      const userIndex = users.findIndex((user) => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      const deletedUser = users.splice(userIndex, 1);
      return deletedUser[0];
    },
  },
};

// Create and start the server
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server Running at: ${url}`);
