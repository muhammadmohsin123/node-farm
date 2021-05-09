const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const tempreplace = require("./modules/replacetemp");
//replace template

const tempoverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempcard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempproduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
//Slugify

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataobj = JSON.parse(data);

const slugs = dataobj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
/////////SERVER
const server = http.createServer((req, res) => {
  const pathName = req.url;

  console.log(req.url);
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardhtml = dataobj.map((el) => tempreplace(tempcard, el)).join(" ");
    const output = tempoverview.replace("{%PRODUCT_CARD%}", cardhtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataobj[query.id];
    const output = tempreplace(tempproduct, product);
    res.end(output);
    //api page
  } else if (pathname === "/api") {
    res.end(data);

    //Not found page
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1> Page not found</h1>");
  }
});

server.listen(8000, () => {
  console.log("Server is Running😃");
});
