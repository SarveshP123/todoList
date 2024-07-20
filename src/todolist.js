import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { ErrorMessage, Formik } from 'formik';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { BsBoxArrowInUp } from 'react-icons/bs';
import Swal from 'sweetalert2';
import './todolist.css'; 

function Crudop() {
  let [records, setRecords] = useState([]);
  let [text, setText] = useState("Save");
  let [edit, setEdit] = useState(false);
  let [user, setUser] = useState({
    categoryId: '',
    category: '',
    description: '',
    createdBy: '',
  });

  let range = yup.object().shape({
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required")
  });

  let handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  let handleSubmit = () => {
    if (edit) {
      handleEdit();
    } else {
      handleSave();
    }
  };

  let handleSave = () => {
    let rate = {
      categoryId: 0,
      category: user.category,
      description: user.description,
      createdBy: 1
    };
    console.log(rate);
    axios.post("http://catodotest.elevadosoftwares.com/Category/InsertCategory", rate);
    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success"
    });
  };

  let handleDelete = (value) => {
    let id = value;
    console.log(id);
    Swal.fire({
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let msg = result.value;
        let data = {
          categoryId: id,
          removedRemarks: msg
        };
        axios.post("http://catodotest.elevadosoftwares.com/Category/RemoveCategory", data);
        Swal.fire("Deleted!", "", "success");
      }
      if (result.isDenied) {
        Swal.fire("Not deleted", "", "info");
      }
    });
  };

  let handleUpdate = (id) => {
    console.log(id);
    let result = records.filter(item => item.categoryId == id);
    console.log(result);
    result.map(val => {
      setUser({
        ...user,
        categoryId: val.categoryId,
        description: val.description,
        category: val.category
      });
    });
    setText("Update");
    setEdit(true);
  };

  let handleEdit = () => {
    console.log(user);
    let data = {
      category: user.category,
      description: user.description,
      categoryId: user.categoryId
    };
    console.log(data);
    axios.post("http://catodotest.elevadosoftwares.com/Category/InsertCategory", data);
    Swal.fire({
      title: "Updated!",
      text: "Data updated successfully",
      icon: "success"
    });
  };

  let custyle = {
    headRow: {
      style: { backgroundColor: "purple" }
    },
    headCell: {
      style: { color: "grey", fontSize: "18px" }
    },
    cells: {
      style: { color: "blue", fontSize: "15px" }
    }
  };

  let column = [
    {
      name: "CategoryId",
      selector: row => row.categoryId,
      sortable: true
    },
    {
      name: "Category",
      selector: row => row.category,
      sortable: true
    },
    {
      name: "Description",
      selector: row => row.description,
      sortable: true
    },
    {
      name: "CreatedBy",
      selector: row => row.createdBy,
      sortable: true
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="action-buttons">
          <Button onClick={() => { handleDelete(row.categoryId) }} variant='' className='button'><BiSolidTrashAlt /></Button>
          <Button onClick={() => { handleUpdate(row.categoryId) }} variant='' className='button'><BsBoxArrowInUp /></Button>
        </div>)
    }
  ];

  let handleCancel = () => {
    setUser({
      category: '',
      description: '',
    });
  };

  useEffect(() => {
    axios.get("http://catodotest.elevadosoftwares.com//Category/GetAllCategories").then(res => {
      setRecords(res.data.categoryList);
    });
  }, []);

  return (
   
    <div className="container fade-in">
      <div style={{backgroundColor:'pink',height:'100vh'}}>
      <Formik
        validationSchema={range}
        onSubmit={handleSubmit}
        initialValues={user}
        enableReinitialize
      >
        {({ handleChange, handleSubmit }) => (
          <Row>
            <Col md={4}></Col>
            <Col md={4}>
              <div className="form-container">
                <Form onSubmit={handleSubmit}>
                  <Form.Group  className="form-control">
                    <Form.Label style={{color:'white',fontSize:'25px'}}>Your Work</Form.Label>
                    <Form.Control type="text" name="category" value={user.category} onChange={(e) => { handleChange(e); handleInput(e) }} />
                    <ErrorMessage name='category' component="div" className="error-message" />
                  </Form.Group>
                  <Form.Group  className="form-control">
                    <Form.Label style={{color:'white',fontSize:'25px'}}>Destination</Form.Label>
                    <Form.Control type="text" name="description" value={user.description} onChange={(e) => { handleChange(e); handleInput(e) }} />
                    <ErrorMessage name='description' component="div" className="error-message" />
                  </Form.Group>
                  <Button type='submit' variant='' className='button'>Save</Button>
                  <br /><br />
                  <button onClick={() => handleCancel()} variant='' className='button'>Cancel</button>
                </Form>
              </div>
            </Col>
            <Col md={4}></Col>
          </Row>
        )}
      </Formik>
      <DataTable
        data={records}
        columns={column}
        customStyles={custyle}
        pagination
        paginationPerPage={3}
        paginationRowsPerPageOptions={[6, 9, 12]}
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        className="data-table"
      />
      </div>
    </div>
  );
}

export default Crudop;
