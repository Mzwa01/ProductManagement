import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Container, Modal, TextField, FormControlLabel, Checkbox } from '@mui/material';
import agent from '../api/agent';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await agent.categories.list();
    setCategories(response.data);
  };

  const handleSaveCategory = async () => {
    if (!categoryName || !categoryCode) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const newCategory = {
      name: categoryName,
      categoryCode: categoryCode,
      isActive: isActive,
      createdDate: new Date()
    };

    if (editCategoryId) {
      await agent.categories.update(editCategoryId, newCategory);
    } else {
      await agent.categories.create(newCategory);
    }
    fetchCategories();
    setShowModal(false);
    setEditCategoryId(null);
  };

  const handleEditCategory = (category) => {
    setCategoryName(category.name);
    setCategoryCode(category.categoryCode);
    setIsActive(category.isActive);
    setEditCategoryId(category.categoryId);
    setShowModal(true);
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            Categories
          </Typography>
          <Button variant="contained" onClick={() => setShowModal(true)}>
            Add Category
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryCode}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{new Date(category.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEditCategory(category)}>
                      Edit
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
            {editCategoryId ? 'Edit Category' : 'Add Category'}
          </Typography>
          <TextField
            label="Name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Category Code"
            fullWidth
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
          <Button variant="contained" onClick={handleSaveCategory} sx={{ marginRight: 2 }}>
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

export default Categories;