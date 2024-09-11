import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  getAlll,
  deleteStudentById,
  getStudentByName,
  saveStudent,
  updateStudent,
} from "../../redux/studentSlice";
import ReactPaginate from "react-paginate";
export default function Student() {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAlll({ currentPage, limit }),
      deleteStudentById,
      getStudentByName,
      saveStudent,
      updateStudent
    );
  }, [currentPage]);
  const { totalPages, students } = useSelector((state) => state.student);
  const [student, setStudent] = useState({
    ten: "Lê Mèo",
    thanhPho: "HCM",
    xeploai: "Giỏi",
    ngaysinh: "2000-01-01",
  });
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const handleDelete = (studentId) => {
    dispatch(deleteStudentById(studentId));
  };
  const handleSearch = (textSearch) => {
    dispatch(getStudentByName(textSearch));
  };
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const coverDateToyyyyMMdd = (date) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const coverDateToddMMyyyy = (date) => {
    const [day, month, year] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "ngaysinh") {
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: coverDateToddMMyyyy(value),
      }));
    }
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };
  const handleSave = () => {
    toggle();
    dispatch(saveStudent(student));
  };
  return (
    <Container>
      <Button color="primary" onClick={toggle}>
        Add New
      </Button>
      <Modal isOpen={modal} toggle={toggle}></Modal>
      <h1>Total: {totalPages}</h1>

      <Label for="exampleSearch">Search</Label>
      <Input
        id="exampleSearch"
        name="search"
        placeholder="search placeholder"
        type="search"
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên sinh viên</th>
            <th>Thành phố</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td scope="row">{item.ten}</td>
                <td>{item.thanhPho}</td>
                <td>
                  <Button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(totalPages)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="ten">Tên</Label>
                    <Input
                      id="ten"
                      name="ten"
                      placeholder="gõ tên"
                      type="text"
                      value={student.ten}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="thanhPho">Thành phố</Label>
                    <Input
                      id="thanhPho"
                      name="thanhPho"
                      placeholder="Thành phố"
                      type="text"
                      value={student.thanhPho}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="xeploai">Xếp loại</Label>
                <Input
                  id="xeploai"
                  name="xepLoai"
                  type="select"
                  onChange={handleChange}
                >
                  <option></option>
                  <option>Giỏi</option>
                  <option>Khá</option>
                  <option>Trung bình</option>
                  <option>Yếu</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="exampleAddress2">Ngày sinh</Label>
                <Input
                  id="ngaySinh"
                  name="ngaySinh"
                  type="date"
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  );
}
