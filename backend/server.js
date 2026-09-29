const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Book = require("./models/Book");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ==========================
// GET ALL BOOKS
// ==========================
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// ==========================
// GET SINGLE BOOK
// ==========================
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

// ==========================
// ADD NEW BOOK
// ==========================
app.post("/api/books", async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      publicationYear,
    } = req.body;

    // Validation
    if (
      !title ||
      !author ||
      !isbn ||
      !category ||
      !publicationYear
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      category,
      publicationYear,
    });

    const savedBook = await book.save();

    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

// ==========================
// UPDATE BOOK
// ==========================
app.put("/api/books/:id", async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      publicationYear,
    } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        isbn,
        category,
        publicationYear,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// ==========================
// DELETE BOOK
// ==========================
app.delete("/api/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

// ==========================
// START SERVER
// ==========================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});