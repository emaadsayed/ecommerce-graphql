const { gql } = require('apollo-server');

export default gql`
type User {
  id: ID
  username: String
  email: String
  role: String
}

type Product {
  id: ID
  title: String
  description: String
  price: Float
  image: String
  category: String
}

type Token {
    token: String
}

type Query {
  user(id: ID!): User
  product(id: ID!): Product
  allProducts(page: Int, limit: Int): [Product]
}
 
type Mutation {
  registerUser(username: String!, email: String!, password: String!): User
  loginUser(email: String!, password: String!): Token
  
  createProduct(title: String!, description: String!, price: Float!, image:String!, category:String!): Product
  updateProduct(id: ID!, title: String, description: String, price: Float, image:String, category:String): Product
  deleteProduct(id: ID!): Boolean
}
`;