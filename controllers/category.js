const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");

exports.list = async (req, res) => {
  try {
    const result = await Category.find({}).select("id name");
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const slug = req.params.slug;
    const result = await Category.findOne({ slug });
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const name = req.body.name.trim();
    if (!name) {
      return res.json({ error: "Name required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Name already exists" });
    }
    const slug = slugify(name).toLowerCase();
    const result = await new Category({
      name,
      slug,
    }).save();
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const name = req.body.name.trim();
    if (!name) {
      return res.json({ error: "Name required" });
    }
    const options = {
      upsert: true,
      new: true,
    };
    const slug = slugify(name).toLowerCase();
    const result = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug,
      },
      options
    );
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    let result = await Category.findOneAndDelete(categoryId);
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.productsByCategory = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(200).json({
        status: "Fail",
        data: "Category not found",
      });
    }

    const result = await Product.find({ category: category._id }).select("-photo");
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};
