import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { uploadImage } from "../../redux/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, FormGroup, Label, Table } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllImage,
  deleteStudentImageById,
  resetStatusAndMessage,
} from "../../redux/studentSlice";
import axios from "axios";
export default function StudentDetail() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();
  const { studentDetail, message, error, status } = useSelector(
    (state) => state.student
  );
  const handle_change = (e) => {
    setFiles(e.target.files);
    console.log("Files: ", e.target.files);
  };
  const handle_submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      await dispatch(uploadImage({ id, formData })).unwrap();

      dispatch(getAllImage(id));
    } catch (error) {
      console.error("Error uploading files", error);
    }
    dispatch(getAllImage(id));
  };

  const fetchImage = async (imageUrl) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/student/images/${imageUrl}`,
        {
          responseType: "blob",
        }
      );
      const imageObjectUrl = URL.createObjectURL(response.data);
      setImage((pre) => ({ ...pre, [imageUrl]: imageObjectUrl }));
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };
  useEffect(() => {
    if (studentDetail) {
      studentDetail.forEach((item) => {
        fetchImage(item.imageUrl);
      });
    }
  }, [studentDetail, dispatch]);
  useEffect(() => {
    dispatch(getAllImage(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (status && message) {
      if (status == 200) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      const timer = setTimeout(() => {
        setShowMessage(false);
        dispatch(resetStatusAndMessage());
      });
    }
  }, [status, message, dispatch]);
  return (
    <Container>
      <ToastContainer />

      <div>
        <h1>Id: {id}</h1>
        <form onSubmit={handle_submit}>
          <FormGroup>
            <Label>Upload Image</Label>
            <input type="file" name="files" multiple onChange={handle_change} />
            <input type="submit" value="save" />
          </FormGroup>
        </form>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Id</th>
              <th>Tên</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentDetail &&
              studentDetail.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.student.ten}</td>
                  <td>
                    <img
                      src={image[item.imageUrl]}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    ></img>
                  </td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
