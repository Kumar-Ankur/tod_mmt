import React from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Form from "./component/FormComponent";
import Header from "./component/HeaderComponent";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  background: "#FAFAFF",
}));

export default function App() {
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={2} md={2}></Grid>
        <Grid item xs={6} md={8}>
          <Item>
            <Form />
          </Item>
        </Grid>
      </Grid>
    </>
  );
}
