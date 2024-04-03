const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const upload = require('../multer/multer');
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
  const [allCategories, allBrands] = await Promise.all([
    Category.find().sort({ name: 1}).exec(),
    Brand.find().sort({ name: 1}).exec(),
  ]);

  res.render("product_form", {
    title: "Create Product",
    categories: allCategories,
    brands: allBrands,
  })
});

// Handle Product create on POST.
exports.product_create_post = [
    upload.single('image'),
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("price", "Must be a number up to 2 decimal places e.g 10.99 or 9.00")
    .trim()
    .isLength({ min: 1 })
    .isFloat({ min: 0, max: 999999.99 }) // Limiting to 2 decimal places and a maximum value of 999999.99
    .toFloat() // Convert to float
    .escape(),
    body("quantity", "Must be a integer between 0 and 99")
    .trim()
    .isLength({ min: 1 })
    .isInt({ min: 0}, { max: 99 })
    .escape(),
    body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.file)
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            brand: req.body.brand,
            category: req.body.category,
            img: req.file.filename,
        });

        if (!errors.isEmpty()) {
            const [allCategories, allBrands] = await Promise.all([
                Category.find().sort({ name: 1}).exec(),
                Brand.find().sort({ name: 1}).exec(),
            ]);
            res.render("product_form", {
                title: "Create Product",
                categories: allCategories,
                brands: allBrands,
                product: product,
                errors: errors.array(),
            });
        } else {
            await product.save();
            res.redirect(product.url);
        }
    }),
];
// Display Product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();

    if (product === null) {
        res.redirect("/inventory/products")
    }
    res.render("product_delete", {
        title: "Delete Product",
        product: product
    });

});

// Handle Product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {

    await Product.findByIdAndDelete(req.body.productid);
    res.redirect("/inventory/products")

});

// Display Product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
    const [product, allBrands, allCategories] = await Promise.all([
        Product.findById(req.params.id).populate("category").exec(),
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
    ])

    if (product === null) {
        const err = new Error("Product not found");
        err.status = 404;
        return next(err)
    }

    res.render("product_form", {
        title: "Update Product",
        brands: allBrands,
        categories: allCategories,
        product: product,
    });
});

// Handle Product update on POST.
exports.product_update_post = [
    upload.single('image'),
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("price", "Must be a number up to 2 decimal places e.g 10.99 or 9.00")
    .trim()
    .isLength({ min: 1 })
    .isFloat({ min: 0, max: 999999.99 }) // Limiting to 2 decimal places and a maximum value of 999999.99
    .toFloat() // Convert to float
    .escape(),
    body("quantity", "Must be a integer between 0 and 99")
    .trim()
    .isLength({ min: 1 })
    .isInt({ min: 0}, { max: 99 })
    .escape(),
    body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const product = await Product.findById(req.params.id).exec();
        const errors = validationResult(req);
        let imgUrl = product.image
        // Check if req.file exists and has filename property
        if (req.file && req.file.filename) {
            //overwrite imgUrl if new file has been selected
            imgUrl = req.file.filename;
        }
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            brand: req.body.brand,
            category: req.body.category,
            img: imgUrl,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const [allCategories, allBrands] = await Promise.all([
                Category.find().sort({ name: 1}).exec(),
                Brand.find().sort({ name: 1}).exec(),
            ]);
            res.render("product_form", {
                title: "Create Product",
                categories: allCategories,
                brands: allBrands,
                product: product,
                errors: errors.array(),
            });
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, newProduct, {});
            res.redirect(updatedProduct.url)
        }
    }),
];
