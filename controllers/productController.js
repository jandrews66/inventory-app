const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [
        numProducts,
        numBrands,
        numCategories,
    ] = await Promise.all([
        Product.countDocuments({}).exec(),
        Brand.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Inventory App Home",
        product_count: numProducts,
        brand_count: numBrands,
        category_count: numCategories,
    })
  });

// Display list of all Products.
exports.product_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}, "name price")
  .sort({ name: 1})
  .populate("category")
  .exec();
  
  res.render("product_list", { title: "Product List", product_list: allProducts})
});

// Display detail page for a specific Product.
exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("category").exec();

    if (product === null) {
        const err = new Error("Product not fond");
        err.status = 404;
        return next(err);
    }

    res.render("product_detail", { 
        title: "Product Detail",
        product: product,
    })
});

// Display Product create form on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product create GET");
});

// Handle Product create on POST.
exports.product_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product create POST");
});

// Display Product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product delete GET");
});

// Handle Product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product delete POST");
});

// Display Product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product update GET");
});

// Handle Product update on POST.
exports.product_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product update POST");
});
