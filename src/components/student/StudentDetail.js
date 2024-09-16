import React, { useState } from "react";
import { useParams } from "react-router";
import { uploadImage } from "../../redux/studentSlice";
import { useDispatch } from "react-redux";
import { Container, FormGroup, Label } from "reactstrap";

export default function StudentDetail() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const handle_change = (e) => {
    setFiles(e.target.files);
    console.log("Files: ", e.target.files);
  };
  const handle_submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      dispatch(uploadImage({ id, formData }));
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };
  return (
    <Container>
      <div>
        <h1>Id: {id}</h1>
        <form onSubmit={handle_submit}>
          <FormGroup>
            <Label>Upload Image</Label>
            <input type="file" name="files" multiple onChange={handle_change} />
            <input type="submit" value="save" />
          </FormGroup>
        </form>
      </div>
    </Container>
  );
}
