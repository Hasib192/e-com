const fs = require("fs");
const Product = require("../models/product");
const slugify = require("slugify");
const { findOne } = require("../models/user");

exports.create = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    if (!name.trim()) {
      res.json({ error: "Name is required" });
    }
    if (!description.trim()) {
      res.json({ error: "Description is required" });
    }
    if (!price && isNaN(price)) {
      res.json({ error: "Price is required" });
    }
    if (!category.trim()) {
      res.json({ error: "Category is required" });
    }
    if (!quantity && isNaN(quantity)) {
      res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...req.fields, slug: slugify(name) });

    product.photo = {
      data: fs.readFileSync(photo.path),
      contentType: photo.type,
    };

    await product.save();

    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.list = async (req, res) => {
  try {
    // https://mongoosejs.com/docs/populate.html#field-selection
    const result = await Product.find({}).populate("category", "name slug").select("-photo");
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const result = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug").select("-photo");
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.photo = async (req, res) => {
  try {
    const result = await Product.findById(req.params.productId, "photo");
    console.log(result);
    if (result.photo.data) {
      res.set("Content-Type", result.photo.contentType);
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      res.status(200).send(result.photo.data);
    }
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
    const result = await Product.findByIdAndDelete(req.params.productId).select("-photo");
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    if (!name.trim()) {
      res.json({ error: "Name is required" });
    }
    if (!description.trim()) {
      res.json({ error: "Description is required" });
    }
    if (!price && isNaN(price)) {
      res.json({ error: "Price is required" });
    }
    if (!category.trim()) {
      res.json({ error: "Category is required" });
    }
    if (!quantity && isNaN(quantity)) {
      res.json({ error: "Quantity is required" });
    }

    const options = {
      upsert: true,
      new: true,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      options
    );

    product.photo = {
      data: fs.readFileSync(photo.path),
      contentType: photo.type,
    };

    await product.save();

    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};
