const Brand = require("../models/brand");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// Display list of all Brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
    const allBrands = await Brand.find({}, "name description")
    .sort({ name: 1})
    .exec();

    res.render("brand_list", { title: "Brand List", brand_list: allBrands})
});

// Display detail page for a specific Brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
    const [brand, productsInBrand] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, "name price").exec(),
    ])
    if (brand === null) {
        const err = new Error("Brand not fond");
        err.status = 404;
        return next(err);
    }
    res.render("brand_detail", {
        title: "Brand Detail",
        brand: brand,
        brand_products: productsInBrand,
    })

});

// Display Brand create form on GET.
exports.brand_create_get = (req, res, next) => {
    res.render("brand_form", { title: "Create Brand" });
  };

// Handle Brand create on POST.
exports.brand_create_post = [
    body("name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Brand name must contain at least 2 characters"),
    body("description")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Description name must contain at least 2 characters"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            name: req.body.name,
            description: req.body.description,
            });

        if (!errors.isEmpty()) {
            res.render("brand_form", {
                title: "Brand Form",
                brand: brand,
                errors: errors.array(),
            });
            return
        } else {
            const brandExists = await Brand.findOne({ name: req.body.name })
            .collation({ locale: "en", strength: 2 })
            .exec();
            if (brandExists) {
                res.redirect(brandExists.url)
            } else {
                await brand.save();
                res.redirect(brand.url)
            }
        }
    }),
]

// Display Brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
    const [brand, allProductsByBrand ] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, "name price").exec(),
    ])

    if (brand === null) {
        res.redirect("/inventory/brands")
    }

    res.render("brand_delete", {
        title: "Delete Brand",
        brand: brand,
        brand_products: allProductsByBrand,
    });
});

// Handle Brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
    const [brand, allProductsByBrand] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, "name price").exec(),
    ]);

    if (allProductsByBrand.length > 0) {
        res.render("brand_delete", {
            title: "Delete Brand",
            brand: brand,
            brand_products: allProductsByBrand,
            
        });
        return;
    } else {
        await Brand.findByIdAndDelete(req.body.brandid);
        res.redirect("/inventory/brands")
    }
});

// Display Brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand update GET");
});

// Handle Brand update on POST.
exports.brand_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand update POST");
});
