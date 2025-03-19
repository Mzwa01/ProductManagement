import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Container, Modal, TextField, Select, MenuItem } from '@mui/material';
import agent from '../api/agent';
import * as XLSX from 'xlsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await agent.products.list();
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await agent.categories.list();
    setCategories(response.data);
  };

  const generateProductCode = () => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sequentialCode = String(products.length + 1).padStart(3, '0');
    return `${yearMonth}-${sequentialCode}`;
  };

  const handleSaveProduct = async () => {
    if (!productName || !productCategory || productPrice <= 0) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    const newProduct = {
      name: productName,
      description: productDescription,
      categoryName: productCategory,
      price: productPrice,
      productCode: editProductId ? products.find(p => p.productId === editProductId).productCode : generateProductCode(),
      createdDate: new Date(),
      image: productImage,
    };
  
    try {
      if (editProductId) {
        await agent.products.update(editProductId, newProduct);
      } else {
        await agent.products.create(newProduct);
      }
      fetchProducts();
      setShowModal(false);
      setEditProductId(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setProductName(product.name);
    setProductDescription(product.description);
    setProductCategory(product.categoryName);
    setProductPrice(product.price);
    setProductImage(product.image);
    setEditProductId(product.productId);
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleExportProducts = async () => {
    try {
      const response = await agent.products.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting products:', error);
    }
  };
  const handleImportProducts = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await agent.products.import(formData);
        alert(response.data); // Show success message
        fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error('Error importing products:', error);
        alert('Failed to import products.');
      }
    }
  };
  // const handleImportProducts = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const json = XLSX.utils.sheet_to_json(worksheet);
  //       try {
  //         await agent.products.import(json);
  //         fetchProducts();
  //       } catch (error) {
  //         console.error('Error importing products:', error);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            Products
          </Typography>
          <Button variant="contained" onClick={() => setShowModal(true)} sx={{ marginRight: 2 }}>
            Add Product
          </Button>
          <Button variant="contained" onClick={handleExportProducts} sx={{ marginRight: 2 }}>
            Export Products
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImportProducts}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button variant="contained" component="span">
              Import Products
            </Button>
          </label>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productCode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>R{product.price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(product.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" sx={{ marginRight: 1 }} onClick={() => handleEditProduct(product)}>
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 3 }}>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            {editProductId ? 'Edit Product' : 'Add Product'}
          </Typography>
          <TextField
            label="Name"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Select
            label="Category"
            fullWidth
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.categoryId} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={productPrice}
            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: '16px' }}
          />
          {productImage && (
            <img src={productImage} alt="Product Preview" style={{ width: '100%', marginBottom: '16px' }} />
          )}
          <Button variant="contained" onClick={handleSaveProduct} sx={{ marginRight: 2 }}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Card>
      </Modal>
    </Container>
  );
};

export default Products;