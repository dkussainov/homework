import { gql } from "@apollo/client";

// Get all users
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      role
      status
      birthdate
    }
  }
`;

// Get single user by ID
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      role
      status
      birthdate
    }
  }
`;

// Create a new user
export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $role: String!
    $status: String!
    $birthdate: Date!
  ) {
    createUser(
      name: $name
      email: $email
      role: $role
      status: $status
      birthdate: $birthdate
    ) {
      id
      name
      email
      role
      status
      birthdate
    }
  }
`;

// Update existing user
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $email: String!
    $role: String!
    $status: String!
    $birthdate: Date!
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      role: $role
      status: $status
      birthdate: $birthdate
    ) {
      id
      name
      email
      role
      status
      birthdate
    }
  }
`;

// Delete user
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
