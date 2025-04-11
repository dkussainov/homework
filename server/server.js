import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLScalarType, Kind } from "graphql";
import { users } from "./mockUsers.js";
import { typeDefs } from "./typedefs.js";

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Custom Date values",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
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

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server Running at: ${url}`);
