// product schema defining the product document structure
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

productSchema.plugin(normalize);
export default mongoose.model('Product', productSchema);