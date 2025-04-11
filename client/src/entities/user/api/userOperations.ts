import { gql } from "@apollo/client";

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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
