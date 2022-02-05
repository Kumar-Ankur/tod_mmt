import React, { useState, useEffect } from "react";
import "./form.css";
import { FormControl, TextField, Button, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import "firebase/database";
import "firebase/storage";
import firebaseConfig from "../firebaseConfig";
import {
  STATE_CHANGED,
  API_URL,
  SAVE_DETAILS,
  HEADER,
  POST,
  SEND_EMAIL,
  SUUCESS_STATUS_CODE,
  MANDATORY_FIELD_MISSING,
  INVALID_IMAGE_FORMAT,
  SUCCESS_MESSAGE,
  FAILURE_MESSAGE,
} from "../constant";

export default function Form() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inCompatibleError, setInCompatibleError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPublishSuccess, setIsPublishSuccess] = useState(false);
  const [isPublishFailure, setIsPublishFailure] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [firebaseDB, setFirebaseDB] = useState(null);
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    setFirebaseDB(firebase.storage());
  }, []);

  /**
   *
   * @function handleClick
   * @description function to check if mandatory field is missing, if not then store image to storage(database) w.r.t uuid
   */

  const handleClick = () => {
    if (!title || !description || !selectedFile) {
      setShowError(true);
      return;
    }
    const unique_id = uuidv4();
    showLoader(true);
    const uploadTask = firebaseDB.ref(`image/${unique_id}`).put(selectedFile);
    uploadTask.on(
      STATE_CHANGED,
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(progress);
      },
      (error) => {
        console.log(error);
        showLoader(false);
      },
      () => {
        firebaseDB
          .ref("image")
          .child(unique_id)
          .getDownloadURL()
          .then((url) => {
            saveDetailsToDb(unique_id, url);
          })
          .catch((error) => {
            setIsPublishFailure(true);
            resetNotification(setIsPublishFailure);
            showLoader(false);
          });
      }
    );
  };

  /**
   * @function saveDetailsToDb
   * @param {number} id
   * @param {string} url
   * @description save the details to the database and call sendEmail function
   */

  const saveDetailsToDb = (id, url) => {
    const payload = {
      id,
      title,
      description,
      url,
    };

    fetch(`${API_URL}${SAVE_DETAILS}`, {
      method: POST,
      headers: HEADER,
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === SUUCESS_STATUS_CODE) {
          sendEmail(payload);
        }
      })
      .catch((err) => {
        setIsPublishFailure(true);
        resetNotification(setIsPublishFailure);
        showLoader(false);
      });
  };

  /**
   * @function sendEmail
   * @param {Object} payload
   * @description function to send email to specific email ID
   */

  const sendEmail = (payload) => {
    fetch(`${API_URL}${SEND_EMAIL}`, {
      method: POST,
      headers: HEADER,
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === SUUCESS_STATUS_CODE) {
          resetField();
          setIsPublishSuccess(true);
          resetNotification(setIsPublishSuccess);
          showLoader(false);
        }
      })
      .catch((err) => {
        setIsPublishFailure(true);
        resetNotification(setIsPublishFailure);
        showLoader(false);
      });
  };

  /**
   * @function resetNotification
   * @param {Function} callback
   * @description function to reset the timer based on callback
   */

  const resetNotification = (callback) => {
    const timer = setTimeout(() => {
      callback(false);
      clearTimeout(timer);
    }, 5000);
  };

  /**
   * @function resetField
   * @description function to reset the state of the form
   */

  const resetField = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
  };

  /**
   * @function validateImage
   * @description function to check whether upload file is image or not
   * @returns Boolean
   */
  const validateImage = (type) => {
    return type.includes("png") || type.includes("jpeg") || type.includes("jpg");
  };

  /**
   *
   * @function selectFile
   * @description function to set the selected file in react state
   */
  const selectFile = (e) => {
    setShowError(false);
    if (e.target.files) {
      if (!validateImage(e.target.files[0].type)) {
        setInCompatibleError(true);
        setSelectedFile(e.target.files[0]);
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
      {loader && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Stack sx={{ width: "100%" }} spacing={2}>
        {showError && <Alert severity="error">{MANDATORY_FIELD_MISSING}</Alert>}
        {inCompatibleError && <Alert severity="error">{INVALID_IMAGE_FORMAT}</Alert>}
        {isPublishSuccess && <Alert severity="success">{SUCCESS_MESSAGE}</Alert>}
        {isPublishFailure && <Alert severity="error">{FAILURE_MESSAGE}</Alert>}
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
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              name="uploadFile"
              onChange={selectFile}
              style={{ marginBottom: "2rem", display: "none" }}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="outlined"
                color={showError && !selectedFile ? "error" : "inherit"}
                component="span"
                style={{ marginBottom: "2rem", color: "#1E2749" }}
              >
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
