import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Container, Grid, CircularProgress } from '@mui/material';
import agent from '../api/agent';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      debugger;
      const [categoriesResponse, productsResponse] = await Promise.all([
        agent.categories.list(),
        agent.products.list(),
      ]);
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  const activeCategories = categories.filter(category => category.isActive).length;
  const avgPrice = products.reduce((sum, product) => sum + product.price, 0) / products.length;

  return (
    <Container>
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Categories
              </Typography>
              <Typography variant="h4" component="div">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Products
              </Typography>
              <Typography variant="h4" component="div">
                {products.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Active Categories
              </Typography>
              <Typography variant="h4" component="div">
                {activeCategories}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Average Price
              </Typography>
              <Typography variant="h4" component="div">
                R{avgPrice.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            Recent Products
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(0, 5).map(product => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productCode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>R{product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;