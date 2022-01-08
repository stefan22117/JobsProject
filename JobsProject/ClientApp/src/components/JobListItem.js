import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Chip, Grid, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";

const styles = (theme) => ({
  root: {
    position: "relative",
    backgroundColor: "#adefd1",
  },
  link: {
    color: "#00203f",
    "&:hover": {
      textDecoration: "none",
      color: "#00203f",
    },
  },
  selectedChip: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginLeft: 5,
  },
  textDescription: {
    backgroundColor: "white",
    margin: 10,
    padding: 2,
    borderRadius: 5,
    height: "5rem",
    wordWrap: "break-word",
  },
  textAmounts: {
    textAlign: "center",
    backgroundColor: "white",
    margin: 10,
    padding: 2,
    borderRadius: 5,
  },
  jobHeader:{
    textAlign: "center" 
  }
});

const JobListItem = ({ id, title, reserved, finished, classes, ...props }) => {
  useEffect(() => {
    Promise.resolve(
      (async () => {
        const response = await axios.get("api/technologies/byJobId/" + id);
        setTechnologies(response.data);
      })()
    );
  }, [id]);
  const [technologies, setTechnologies] = useState([]);

  return (
    <Paper
      className={classes.root}
      elevation={2}
      style={{
        backgroundColor: reserved ? "orange" : "#adefd1",
        border: finished ? "2px solid red" : "",
      }}
    >
      <Link to={"/jobs/" + id} className={classes.link}>

        <h3 className={classes.jobHeader}>
          {reserved
            ? (title.length > 10 ? title.slice(0, 10) + "..." : title) +
              " (RESERVED)"
            : title.length > 20
            ? title.slice(0, 20) + "..."
            : title}
        </h3>
            <hr />
        <p className={classes.textDescription}>
          {props?.description?.length > 150
            ? props.description.slice(0, 150) + "..."
            : props.description}
        </p>
        <Grid container>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: reserved ? "orange" : "#adefd1" }}>
                Min.{" "}
              </span>{" "}
              {props.minAmount}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: reserved ? "orange" : "#adefd1" }}>
                Max.{" "}
              </span>
              {props.maxAmount}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: reserved ? "orange" : "#adefd1" }}>
                Valute{" "}
              </span>
              {props?.valute?.label}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: reserved ? "orange" : "#adefd1" }}>
                Type{" "}
              </span>
              {props.paymentType}
            </p>
          </Grid>
        </Grid>
        <hr />
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {technologies.map((tech, i) => (
            <Chip
              className={classes.selectedChip}
              style={{ color: reserved ? "orange" : "#adefd1" }}
              key={i}
              label={tech.name}
            />
          ))}
        </Box>
        <hr />
      </Link>
    </Paper>
  );
};

export default withStyles(styles)(JobListItem);
