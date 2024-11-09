import React from "react";
import Product from "../components/Product";
import Hero from "../components/Hero";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  if (loading) return <h1>Loading</h1>;
  if (error) {
    console.log(error.message);
  }

  return (
    <div>
      <Hero />
      <div className="fixed bottom-10 right-5 z-50">
        <button
          className=" text-white bg-red-500 rounded-full transition duration-300"
          style={{ width: "50px", height: "50px" }}
          onClick={() => navigate("/chat")}
        >
          <FontAwesomeIcon icon={faComment} className="text-white" />
        </button>
      </div>
      <section className="py-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Explore Our Products
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
            {data.allProducts.map((product) => {
              return <Product product={product} key={product.id} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
