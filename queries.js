// ....Find all books in a specific genre

// ..Example: Find all books in the "Historical Fiction" genre.

db.books.find({ genre: "Historical Fiction" })


// .Find books published after a certain year

// Example: Find all books published after 2000.

db.books.find({ published_year: { $gt: 2000 } })

// . Find books by a specific author

// Example: Find all books written by "Chinua Achebe".

db.books.find({ author: "Chinua Achebe" })

// Update the price of a specific book

// Example: Update the price of "The Great Gatsby" to 15.50.

db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 15.50 } }
)


// Delete a book by its title

// Example: Delete the book "Beloved".
db.books.deleteOne({ title: "Beloved" })


// filter books that are in stock and published after 1990

db.books.find({ in_stock: true, published_year: { $gt: 1990 } })

// project only title, author and price of books in the "Science Fiction" genre

db.books.find(
  { genre: "Fantasy" },
  { title: 1, author: 1, price: 1, _id: 0 }
)

// sort books by price in ascending order
db.books.find().sort({ price: 1 })
db.books.find().sort({ price: -1 })

// paginate results to get the second page of books with 5 books per page
db.books.find().skip(5).limit(5)


// ================================
// Aggregation Tasks for Books
// ================================

// 1️⃣ Calculate the average price of books by genre
print("=== Average Price of Books by Genre ===");
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] }
    }
  }
]).forEach(printjson);

// --------------------------------------------

// 2️⃣ Find the author with the most books
print("\n=== Author with the Most Books ===");
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { totalBooks: -1 }
  },
  {
    $limit: 1
  }
]).forEach(printjson);

// --------------------------------------------

// 3️⃣ Group books by publication decade and count them
print("\n=== Number of Books by Publication Decade ===");
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$year", 10] } }, 10 ] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]).forEach(printjson);

// create an index on author and published_year to optimize queries filtering by these fields
db.books.createIndex({ title: 1 })

db.books.createIndex({ author: 1, published_year: 1 })
