const Product = require("./models/Product");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const products = [
  // 1–5: Men
  {
    name: "Men's Classic Black T-Shirt",
    description:
      "A soft, breathable black crew-neck t-shirt designed for everyday comfort and effortless layering.",
    price: 499,
    image: "https://i.imgur.com/9DqEOV5.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 80,
  },
  {
    name: "Men's White Crew-Neck T-Shirt",
    description:
      "A timeless white crew-neck tee made from lightweight cotton, perfect for casual or smart-casual outfits.",
    price: 549,
    image: "https://i.imgur.com/axsyGpD.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 90,
  },
  {
    name: "Men's Heather Gray Hoodie",
    description:
      "Cozy heather gray hoodie with a kangaroo pocket and adjustable drawstring, ideal for cool evenings.",
    price: 1599,
    image: "https://i.imgur.com/cHddUCu.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 60,
  },
  {
    name: "Men's Red Pullover Hoodie",
    description:
      "Vibrant red pullover hoodie with ribbed cuffs and hem for a snug and sporty fit.",
    price: 1499,
    image: "https://i.imgur.com/1twoaDy.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 55,
  },
  {
    name: "Men's Black Joggers",
    description:
      "Tapered black joggers with elastic waistband and ankle cuffs, perfect for lounging or light workouts.",
    price: 1299,
    image: "https://i.imgur.com/ZKGofuB.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 70,
  },

  // 6–10: Women
  {
    name: "Women's Classic White Tee",
    description:
      "Soft white t-shirt with a flattering fit, ideal for pairing with jeans, skirts, or shorts.",
    price: 599,
    image: "https://i.imgur.com/Y54Bt8J.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 85,
  },
  {
    name: "Women's High-Waisted Athletic Shorts",
    description:
      "High-waisted performance shorts with stretchy fabric that stays in place during workouts.",
    price: 899,
    image: "https://i.imgur.com/eGOUveI.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 65,
  },
  {
    name: "Women's Olive Chino Shorts",
    description:
      "Tailored olive chino shorts with a smooth waistband and practical pockets for everyday wear.",
    price: 999,
    image: "https://i.imgur.com/UsFIvYs.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
  },
  {
    name: "Women's Black Hooded Sweatshirt",
    description:
      "Minimal black hooded sweatshirt made from soft, durable fabric for a clean, casual look.",
    price: 1699,
    image: "https://i.imgur.com/cSytoSD.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
  },
  {
    name: "Women's Red Jogger Sweatpants",
    description:
      "Comfortable red jogger sweatpants with tapered legs and elastic cuffs for a modern fit.",
    price: 1399,
    image: "https://i.imgur.com/9LFjwpI.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 60,
  },

  // 11–15: Kids
  {
    name: "Kids Blue Graphic T-Shirt",
    description:
      "Soft blue t-shirt for kids featuring a fun graphic print and an easy, relaxed fit.",
    price: 399,
    image: "https://i.imgur.com/jb5Yu0h.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 75,
  },
  {
    name: "Kids Red Hoodie",
    description:
      "Warm red hoodie for kids with a front pocket and ribbed cuffs for extra comfort.",
    price: 799,
    image: "https://i.imgur.com/FDwQgLy.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 65,
  },
  {
    name: "Kids Navy Joggers",
    description:
      "Navy blue joggers for kids with an adjustable drawstring waist and soft fabric for active days.",
    price: 699,
    image: "https://i.imgur.com/GJi73H0.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 70,
  },
  {
    name: "Kids Olive Shorts",
    description:
      "Lightweight olive shorts designed for everyday play, with a comfortable elastic waistband.",
    price: 499,
    image: "https://i.imgur.com/YIq57b6.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 55,
  },
  {
    name: "Kids Classic White Tee",
    description:
      "Everyday white t-shirt for kids, crafted from breathable cotton for all-day comfort.",
    price: 349,
    image: "https://i.imgur.com/T8oq9X2.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 80,
  },

  // 16–20: Mixed accessories/apparel
  {
    name: "Men's Navy Baseball Cap",
    description:
      "Navy baseball cap with a structured front panel and adjustable strap for a custom fit.",
    price: 599,
    image: "https://i.imgur.com/R3iobJA.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 100,
  },
  {
    name: "Women's Classic Blue Baseball Cap",
    description:
      "Casual blue cap with a curved visor, perfect to pair with athleisure or jeans.",
    price: 649,
    image: "https://i.imgur.com/wXuQ7bm.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 95,
  },
  {
    name: "Kids Red Baseball Cap",
    description:
      "Bright red cap sized for kids, ideal for sunny outdoor play and school trips.",
    price: 399,
    image: "https://i.imgur.com/cBuLvBi.jpeg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 90,
  },
  {
    name: "Men's Graphic Mountain T-Shirt",
    description:
      "Black t-shirt featuring a monochrome mountain graphic for an outdoors-inspired look.",
    price: 699,
    image: "https://i.imgur.com/QkIa5tT.jpeg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 65,
  },
  {
    name: "Women's Classic Black T-Shirt",
    description:
      "Versatile black tee with a slim yet comfortable fit, ideal for layering or wearing solo.",
    price: 649,
    image: "https://i.imgur.com/SZPDSgy.jpeg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 70,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log("Existing products removed");

    await Product.insertMany(products);
    console.log("Products seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedProducts();
