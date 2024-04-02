const Category = require("../models/category");
const Product = require("../models/product")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categorys.
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name").sort({ name: 1}).exec();
    res.render("category_list", { title: "Category List", category_list: allCategories});
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "name price").exec(),
    ])
    if (category === null) {
        const err = new Error("Category not fond");
        err.status = 404;
        return next(err);
    }
    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        category_products: productsInCategory,
    })

});

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
  };

// Handle Category create on POST.
exports.category_create_post = [
    body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Category Form",
                category: category,
                errors: errors.array(),
            });
            return
        } else {
            const categoryExists = await Category.findOne({ name: req.body.name })
            .collation({ locale: "en", strength: 2 })
            .exec();
            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                await category.save();
                res.redirect(category.url)
            }
        }
    }),
]

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, allProductsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "name price").exec(),
    ]);

    if (category == null){
        res.redirect("inventory/categories")
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_products: allProductsByCategory,
    });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allProductsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "name price").exec(),
    ]);

    if (allProductsByCategory.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_products: allProductsByCategory,
        });
        return;
    } else {
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect("/inventory/categories")
    }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null){
        const err = new Error("Category not found");
        err.status = 404;
        return next (err);
    }

    res.render("category_form", {
        title: "Update Category",
        category: category,
    });
});

// Handle Category update on POST.
exports.category_update_post = [
    body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ 
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Category Form",
                category: category,
                errors: errors.array(),
            });
            return
        } else {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(updatedCategory.url)
        }
    }),
]
