import { Box, Button, Chip, Grid, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as techtnologyActions from "../redux/actions/technologyActions";

import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  selectedChip: {
    backgroundColor: "#adefd1",
    color: "#00203f",
    marginLeft: 5,
    marginTop: 5,
    "&:hover": {
      backgroundColor: "#adefd1",
    },
  },
  "&.MuiChip-root": {
    backgroundColor: "#adefd1",
  },
  field: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
      // height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    backgroundColor: "#00203f",
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 5,

    // border: "1px solid #00203f",
    paddingBottom: 5,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // maxHeight:'40vh',
    overflowY: "auto",
  },
  searchTechnologies: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        // borderColor: "#00203f",
        border: "none",
      },
    },
    "& .MuiInputBase-root": {
      color: "#adefd1",
    },

    flexBasis: "50px",

    width: "100%",
    backgroundColor: "#00203f",
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  message: {
    color: "#adefd1",
    margin: 20,
    fontSize: "1rem",
    fontStyle: "italic",
  },
});

const ProfileUnchosenTechnologies = ({
  handleTechClick,
  type,
  classes,
  ...props
}) => {
  const [searchWord, setSearchWord] = useState("");
  const handleSearchWord = (e) => {
    setSearchWord(e.target.value);

    // props.searchTechnology(e.target.value);
  };
  const [unchosenTechs, setUnchosenTechs] = useState([]);
  useEffect(() => {
    if (type == "user") {
      setUnchosenTechs(props.technologiesByUserId);
    } else if (type == "job") {
      setUnchosenTechs(props.technologiesByJobId);
    }
  }, [props.technologiesByUserId, props.technologiesByJobId]);

  return (
    <>
      <TextField
        className={classes.searchTechnologies}
        variant="outlined"
        placeholder="search..."
        value={searchWord}
        onChange={handleSearchWord}
        style={{}}
      />
      <Box
        sx={{ display: "flex", flexWrap: "wrap" }}
        className={classes.field}
        style={{
          flexGrow: 1,
          width: "100%",
          overflow: "auto",
        }}
      >
        {props.allTechnologies.filter(
          (t) =>
            !unchosenTechs.map((x) => x.id).includes(t.id) &&
            t.name.toLowerCase().includes(searchWord.toLowerCase())
        ).length ? (
          props.allTechnologies
            .filter(
              (t) =>
                !unchosenTechs.map((x) => x.id).includes(t.id) &&
                t.name.toLowerCase().includes(searchWord.toLowerCase())
            )
            .map(
              (t, i) =>
                t.name.toLowerCase().includes(searchWord.toLowerCase()) && (
                  // <Button
                  //   variant="contained"
                  //   key={i}
                  //   color="secondary"
                  //   onClick={() => handleTechClick(unchosenTechs, t)}
                  // >
                  //   {t.name}
                  // </Button>

                  <Chip
                    className={classes.selectedChip}
                    onClick={() => handleTechClick(unchosenTechs, t)}
                    key={i}
                    label={t.name}
                  />
                )
            )
        ) : // ako je searchword, napisi nema nehnologija koje zadovoljavaju kriterijume

        props.allTechnologies.filter(
            (t) => !unchosenTechs.map((x) => x.id).includes(t.id)
          ).length == 0 ? (
          type == "user" ? (
            <p className={classes.message}>
              Dodali ste sve tehnologije koje su u opticaju
            </p>
          ) : (
            <p className={classes.message}>
              Dodali ste sve tehnologije koje su u opticaju
            </p>
          )
        ) : (
          props.allTechnologies.filter(
            (t) =>
              !unchosenTechs.map((x) => x.id).includes(t.id) &&
              t.name.toLowerCase().includes(searchWord.toLowerCase())
          ).length == 0 && (
            <p className={classes.message}>
              Nema tehnologije sa nazivom {searchWord}
            </p>
          )
        )}
      </Box>

     
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  allTechnologies: state.technologiesReducer.list,
  technologiesByUserId: state.technologiesReducer.technologiesByUserId,
  technologiesByJobId: state.technologiesReducer.technologiesByJobId,
});
const mapDispatchToProps = {
  //   getLoggedUser: userActions.getLoggedUser,
  // searchTechnology: techtnologyActions.fetchByWord,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProfileUnchosenTechnologies));
