import React, { useState, useEffect } from "react";
import "./form.css";
import { FormControl, TextField, Input, Button, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import firebase from "firebase/app";
// import "firebase/database";
import firebaseConfig from "../firebaseConfig";
import { json } from "body-parser";

export default function Form() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inCompatibleError, setInCompatibleError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [firebaseDB, setFirebaseDB] = useState(null);

  // useEffect(() => {
  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(firebaseConfig);
  //   } else {
  //     firebase.app(); // if already initialized, use that one
  //   }
  //   setFirebaseDB(firebase.database());
  // }, []);

  const handleClick = async () => {
    if (!title || !description) {
      setShowError(true);
      return;
    }
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    const payload = {
      title,
      description,
    };
    // fetch("http://localhost:5000/todDetails", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });
    // firebaseDB
    //   .ref("/tod/" + new Date().toUTCString())
    //   .set(payload)
    //   .then((res) => {
    //     console.log(res);
    //   });
  };

  const validateImage = (type) => {
    return type.includes("png") || type.includes("jpeg") || type.includes("jpg");
  };
  const selectFile = (e) => {
    if (e.target.files) {
      if (!validateImage(e.target.files[0].type)) {
        setInCompatibleError(true);
        setSelectedFile(null);
        var timer = setTimeout(() => {
          setInCompatibleError(false);
          clearTimeout(timer);
        }, 3000);
        return;
      } else {
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  return (
    <>
      <Stack sx={{ width: "100%" }} spacing={2}>
        {showError && <Alert severity="error">Please fill out mandatory field!</Alert>}
        {inCompatibleError && <Alert severity="error">Image should only accepts png, jpeg or jpg format </Alert>}
      </Stack>
      <div className="formStyle">
        <FormControl fullWidth={true} margin="normal">
          <TextField
            id={showError && !title ? "outlined-error" : "outlined-basic"}
            error={showError && !title}
            label="Term of Day"
            variant="outlined"
            value={title}
            style={{ marginBottom: "2rem" }}
            onChange={(e) => {
              setTitle(e.target.value);
              setShowError(false);
            }}
          />

          <TextField
            id={showError && !description ? "outlined-error" : "outlined-basic"}
            error={showError && !description}
            label="Description"
            placeholder="Enter your description..."
            multiline
            variant="outlined"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setShowError(false);
            }}
            style={{ marginBottom: "2rem" }}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Input accept="image/*" id="contained-button-file" type="file" onChange={selectFile} style={{ marginBottom: "2rem", display: "none" }} />
            <label htmlFor="contained-button-file">
              <Button variant="outlined" component="span" style={{ marginBottom: "2rem", color: "#1E2749" }}>
                Upload Image
              </Button>
              <span className="image_name">{selectedFile ? selectedFile.name : null}</span>
            </label>
          </Stack>
          <Button variant="outlined" endIcon={<SendIcon />} style={{ color: "#1E2749" }} onClick={handleClick}>
            Send
          </Button>
        </FormControl>
      </div>
    </>
  );
}
