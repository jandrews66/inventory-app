const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    img: { type: String},


});

//virtual for url

ProductSchema.virtual("url").get(function () {
    return `/inventory/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);