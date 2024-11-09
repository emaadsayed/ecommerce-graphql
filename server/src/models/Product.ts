import mongoose, { Document } from 'mongoose';

interface IProductModel extends Document {
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    }
});


const Product = mongoose.model<IProductModel>('Product', ProductSchema);
export default Product;