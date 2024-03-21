#! /usr/bin/env node

console.log(
  'This script populates some products, brands and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Brand = require("./models/brand");
const Category = require("./models/category");

const brands = [];
const categories = [];
const products = [];


const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBrands();
  await createCategories();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function brandCreate(index, name, description) {
  const brand = new Brand({ name: name, description: description });
  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}


async function productCreate(index, name, description, price, quantity, brand, category) {
  const productdetail = {
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    brand: brand,
    category: category,
  };

  const product = new Product(productdetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}


async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Snowboards"),
    categoryCreate(1, "Bindings"),
    categoryCreate(2, "Boots"),
    categoryCreate(3, "Helmets"),
    categoryCreate(4, "Goggles"),
  ]);
}
async function createBrands() {
  console.log("Adding Brands");
  await Promise.all([
    brandCreate(0, "Jones", "Jones is an innovator of high performance and sustainably made gear for snowboarding and winter backcountry adventures."),
    brandCreate(1, "Burton", "Burton develops snowboards, boots, bindings, outerwear, apparel, and bags for the most demanding riders."),
    brandCreate(2, "Union", "Dedicated to manufacturing the best snowboard bindings. Designed, tested and engineered in Italy."),
    brandCreate(3, "Smith", "Smith Optics sets the standard for high performance sunglasses, goggles and helmets"),
    brandCreate(4, "Salomon", "SALOMON International: Sporting goods for men, women and children. Ski boots and clothing. Snowboarding, trail running and hiking clothes & shoes."),
  ]);
}

async function createProducts() {
  console.log("Adding Products");
  await Promise.all([
    productCreate(0,
      "Jones Aviator 2.0 Snowboard 2024",
      "The Jones Aviator 2.0 Snowboard is a directional twin for advanced riders hitting the resort with all guns blazing. It incorporates a featherweight honeycomb Koroyd material in the nose for superior vibration damping at high speeds, and a full camber profile for the best possible edge-hold and pop.",
      749.99,
      6,
      brands[0],
      categories[0]
    ),
    productCreate(1,
      "Burton Custom X Snowboard 2024",
      "The Burton Custom X Snowboard is the specced-out version of the classic, pairing all of the top materials and construction techniques in the Burton arsenal with the timeless Custom shape. The combination of traditional camber with a directional twin shape and a setback stance is straight out of the snowboarding hall of fame, a tried and true recipe for all mountain prowess. ",
      769.98,
      10,
      brands[1],
      categories[0]
    ),
    productCreate(2,
      "Union Force Snowboard Bindings 2024",
      "Life moves fast, and you have to keep innovating to keep pace with the best. That's why the legendary Union Force Snowboard Bindings have been redesigned from the ground up. Union has put their most cutting edge technology into these bindings, and the results are spectacular",
      343.96,
      12,
      brands[2],
      categories[1]
    ),
    productCreate(3,
      "Jones Orion Snowboard Bindings 2024",
      "Orion: the hunter of Greek mythology. It's a little known fact that Orion primarily hunted on a snowboard in the dead of winter for side hits and kickers to feast on. Hence, the Jones Orion Snowboard Bindings, which are engineered for freeriders sniffing out any opportunity to send and stomp in natural terrian.",
      357.00,
      8,
      brands[0],
      categories[1]
    ),
    productCreate(4,
      "Salomon Huck Knife Pro Snowboard 2024",
      "The Salomon Huck Knife Pro Snowboard is a high performance park board designed to meet the freestyle needs of flippers and huckers around the mountains. A true twin, the Huck Knife Pro features an aggressive camber profile designed to absorb impacts and keep you steady, both before and after big air.",
      543.96,
      10,
      brands[4],
      categories[0]
    ),
    productCreate(5,
      "Smith Method MIPS Helmet",
      108.00,
      18,
      brands[3],
      categories[3]
    ),
    productCreate(6,
      "Smith I/O Mag Goggles",
      "It's awfully hard to ride if you're all fogged up and can barely see... Eradicate poor vision and elevate your experience from top to bottom with the Smith I/O MAG Goggles. Featuring the gold-standard Smith MAG lens change system that utilizes magnets for fast n' easy swaps, two ChromaPop™ lens options to match the conditions, and 5X™ anti-fog lens treatments for the ultimate in fog-free performance.",
      192.00,
      21,
      brands[3],
      categories[4]
    ),
    productCreate(7,
      "Salomon Sentry Prime Sigma Goggles",
      "Achieve the perfect blend of cool and cutting-edge goggle technology with the Salomon Sentry Prime Sigma Goggles. Equipped with magnetic SIGMA™ lenses for color-amplifying clarity in varying conditions, these goggles make lens swapping a breeze. The Custom ID face foam molds to your face and Antifog+ treatment keeps those lenses crystal clear in all weather.",
      191.86,
      3,
      brands[4],
      categories[4]
    ),
    productCreate(8,
      "Burton SLX Snowboard Boots 2024",
      "Feel the thrill of the slopes without sacrificing comfort or performance with the Burton SLX Snowboard Boots. Like their automotive trim level namesake, the SLX's are crafted with a blend of superior materials and cutting-edge design, these boots deliver unmatched support and responsiveness for the ultimate riding experience. Get ready to shred like a pro while keeping your feet happy and stylishly ahead of the game.",
      629.00,
      4,
      brands[1],
      categories[2]
    ),
  ]);
}


