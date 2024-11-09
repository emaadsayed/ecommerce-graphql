import { gql } from "@apollo/client";
export const SIGNUP_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      id
      username
      email
      role
    }
  }
`;

export const SIGNIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`;
