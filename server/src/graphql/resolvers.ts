import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Redis from "ioredis";

import User from "../models/User";
import Product from "../models/Product";

// Define Redis configuration
const redisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};

// Create a Redis client
const redis = new Redis(redisOptions);

redis.ping((err:any, result:any) => {
  if (err) {
    console.error('Failed to connect to Redis:', err);
  } else {
    console.log('Connected to Redis. Server version:', result);
  }
});

interface UserInput {
  username: string;
  email: string;
  password: string;
}

interface ProductInput {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      try {
        // Validate and fetch a user by ID
        if (!validator.isMongoId(id)) {
          throw new Error("Invalid user ID");
        }

        const user = await User.findById(id);

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        throw new Error("Could not fetch user: " + error.message);
      }
    },
    product: async (_: any, { id }: { id: string }) => {
      try {
        // Validate and fetch a product by ID
        if (!validator.isMongoId(id)) {
          throw new Error("Invalid product ID");
        }

        const cacheKey = `product:${id}`;
        const cachedProduct = await redis.get(cacheKey);

        if (cachedProduct) {
          // If cached, return the cached product data
          return JSON.parse(cachedProduct);
        }

        const product = await Product.findById(id);

        if (!product) {
          throw new Error("Product not found");
        }

        // Cache the product data for 60 seconds
        await redis.set(cacheKey, JSON.stringify(product), "EX", 60);

        return product;
      } catch (error) {
        throw new Error("Could not fetch product: " + error.message);
      }
    },
    allProducts: async (
      _: any,
      { page, limit }: { page: number; limit: number }
    ) => {
      try {
         // Fetch a list of products with pagination
        const pageNumber = page || 1;
        const itemsPerPage = limit || 10;

        if (
          !validator.isInt(String(pageNumber)) ||
          !validator.isInt(String(itemsPerPage))
        ) {
          throw new Error("Invalid page or limit value");
        }

        const skip = (pageNumber - 1) * itemsPerPage;

        const cacheKey = `allProducts:${pageNumber}:${itemsPerPage}`;
        const cachedProducts = await redis.get(cacheKey);

        if (cachedProducts) {
           // If cached, return the cached product data
          return JSON.parse(cachedProducts);
        }

        const products = await Product.find().skip(skip).limit(limit);

         // Cache the product data for 60 seconds
        await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

        return products;
      } catch (error) {
        throw new Error("Could not fetch products: " + error.message);
      }
    },
  },
  Mutation: {
    registerUser: async (_: any, { username, email, password }: UserInput) => {
      try {
        // Register a new user with validation and password hashing
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        return user;
      } catch (error) {
        throw new Error("Could not register user: " + error.message);
      }
    },
    loginUser: async (_: any, { email, password }: UserInput) => {
      const SECRET = process.env.JWT_SECRET;
      try {
        // Log in a user with validation
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // JWT token generation
        const token = jwt.sign({ userId: user.id }, SECRET);

        return { token };
      } catch (error) {
        throw new Error("Could not log in: " + error.message);
      }
    },
    createProduct: async (
      _: any,
      { title, description, price, image, category }: ProductInput,
      { userId }: { userId: string }
    ) => {
      try {
        // Check if user has access or not
        if (!userId) {
          throw new Error("Access Denied");
        }

        // Create a new product with validation
        if (!validator.isLength(title, { min: 1, max: 255 })) {
          throw new Error("Title must be between 1 and 255 characters");
        }

        if (!validator.isLength(description, { max: 255 })) {
          throw new Error("Description can be at most 255 characters");
        }

        if (!validator.isInt(String(price))) {
          throw new Error("Invalid price");
        }

        if (!validator.isURL(image)) {
          throw new Error("Invalid image URL");
        }

        const product = new Product({
          title,
          description,
          price,
          image,
          category,
        });
        await product.save();
        return product;
      } catch (error) {
        if (error.message) throw new Error(error.message);

        throw new Error("Error Adding Product!");
      }
    },
    updateProduct: async (
      _: any,
      { id, title, description, price, image, category }: ProductInput,
      { userId }: { userId: string }
    ) => {
      try {
        // Check if user has access or not
        if (!userId) {
          throw new Error("Access Denied");
        }

        // Update an existing product with validation
        if (!validator.isMongoId(id)) {
          throw new Error("Invalid product ID");
        }

        if (!validator.isLength(title, { min: 1, max: 255 })) {
          throw new Error("Title must be between 1 and 255 characters");
        }

        if (!validator.isLength(description, { max: 255 })) {
          throw new Error("Description can be at most 255 characters");
        }

        if (!validator.isInt(String(price))) {
          throw new Error("Invalid price");
        }

        if (!validator.isURL(image)) {
          throw new Error("Invalid image URL");
        }

        const product = await Product.findByIdAndUpdate(
          id,
          { title, description, price, image, category },
          { new: true }
        );

        if (!product) {
          throw new Error("Product not found");
        }
        return product;
      } catch (error) {
        if (error.message) throw new Error(error.message);

        throw new Error("Error Updating Product!");
      }
    },
    deleteProduct: async (
      _: any,
      { id }: { id: string },
      { userId }: { userId: string }
    ) => {
      try {
        // Check if user has access or not
        if (!userId) {
          throw new Error("Access Denied");
        }

        if (!validator.isMongoId(id)) {
          throw new Error("Invalid product ID");
        }

        // Delete a product by ID
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
          throw new Error("Product not found");
        }
        return true;
      } catch (error) {
        if (error.message) throw new Error(error.message);

        throw new Error("Error Deleting Product!");
      }
    },
  },
};
