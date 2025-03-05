// Custom pagination with filtering logic
server.get('/products', (req, res) => {
    // Get query parameters
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._per_page) || 50;
  
    // Get filter parameters (if any)
    const skuFilter = req.query.sku || '';
    const categoryFilter = req.query.category || '';
  
    // Get data from the db
    const db = router.db;
    let products = db.get('products').value();
  
    // Apply filtering logic
    if (skuFilter) {
      products = products.filter(product => product.sku.includes(skuFilter));
    }
  
    if (categoryFilter) {
      products = products.filter(product => product.category.includes(categoryFilter));
    }
  
    // Pagination logic
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
  
    // Return the filtered and paginated results
    res.setHeader('X-Total-Count', totalItems);
    res.jsonp({ pagination, items: paginatedProducts });
  });