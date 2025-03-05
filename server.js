const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);

// Custom pagination logic
server.get('/products', (req, res) => {
const page = parseInt(req.query._page) || 1;
const limit = parseInt(req.query._per_page) || 8;
  
  // Get data from the db
  const db = router.db;
  const products = db.get('products').value();

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / limit);

  // Get the items for the current page
  const paginatedProducts = products.slice((page - 1) * limit, page * limit);

  // Add pagination metadata
  const pagination = {
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    last: totalPages,
    pages: totalPages,
    items: totalItems,
  };

  res.setHeader('X-Total-Count', totalItems);
  res.jsonp({ pagination, items: paginatedProducts });
});

server.use(router);
server.listen(port, () => {
  console.log('JSON Server is running');
});