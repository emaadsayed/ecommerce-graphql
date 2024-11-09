import {gql} from '@apollo/client'
export const GET_ALL_PRODUCTS = gql`
query Query {
    allProducts {
      id
      title
      description
      price
      image
      category
    }
  }
`

export const GET_PRODUCTS = gql`
query Query($productId: ID!) {
    product(id: $productId) {
      id
      title
      description
      price
      image
      category
    }
  }
`