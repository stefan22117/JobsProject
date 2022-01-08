import { Grid, Paper } from "@material-ui/core";
import {
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
  Work,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import * as freelancerActions from "../redux/actions/freelancerActions";
const VerifyEmail = ({ user, ...props }) => {
  const history = useHistory();
  const params = useParams();
  useEffect(() => {
    freelancerActions
      .emailVerify(params.token)
      .then(() => {
        setShow("success");
      })
      .catch((err) => {
        setShow("error");
      });
      document.getElementById("root").style.overflow = "hidden";
  }, []);

  const [show, setShow] = useState("success"); //null staviti inicijaln o

  
  return (
    <Grid
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#00203f",
        position: "fixed",
        top: 0,
        left: 0,
      }}
      container
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        elevation={2}
        style={{
          width: "50%",
          color: "#00203f",
          backgroundColor: "#adefd1",
        }}
      >
        <Grid container justifyContent="center">
          <Grid
            container
            item
            md={2}
            justifyContent="center"
            alignItems="center"
          >
            <Work
              style={{
                cursor: "pointer",
                fontSize: "3rem",
              }}
              onClick={() => history.push("/")}
            />
          </Grid>
          <Grid item md={10}>
            <h1
              style={{
                textAlign: "center",
              }}
            >
              EMAIL VERIFICATION
            </h1>
          </Grid>
          <Grid item md={12}>
            {show == "success" ? (
              <p
                style={{
                  textAlign: "center",
                }}
              >
                You have verified your email <SentimentVerySatisfied />
              </p>
            ) : show == "error" ? (
              <p
                style={{
                  textAlign: "center",
                }}
              >
                You did not verified your email, try again{" "}
                <SentimentVeryDissatisfied />
              </p>
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default VerifyEmail;
