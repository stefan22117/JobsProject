import { Box, Button, Chip, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  selectedChip: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginLeft: 5,
    marginTop: 5,
    '&:hover':{
      backgroundColor: "#00203f",
    }
  },
  "&.MuiChip-root": {
    backgroundColor: "#00203f",
  },
  field: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    backgroundColor: "#adefd1",
    borderRadius: 5,
    marginBottom: 5,

    border: "1px solid #00203f",
    paddingBottom: 5,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflowY: "auto",
  },
  message: {
    color: "#00203f",
    margin: 20,
    fontSize: "1rem",
    fontStyle: "italic",
  },
});

const ProfileChosenTechnologies = ({
  handleTechClick,
  type,
  error,
  classes,
  ...props
}) => {
  const [chosenTechs, setChosenTechs] = useState([]);
  useEffect(() => {
    if (type == "user") {
      setChosenTechs(props.technologiesByUserId);
    } else if (type == "job") {
      setChosenTechs(props.technologiesByJobId);
    }
  }, [props.technologiesByUserId, props.technologiesByJobId]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }} className={classes.field}
    style={{
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: error
        ? "red"
        : "#00203f", //"#00203f"
    }}
    >
      {chosenTechs.length ? (
        chosenTechs.map((tech, i) => (
          <Chip
            className={classes.selectedChip}
            onClick={() => handleTechClick(chosenTechs, tech)}
            key={i}
            label={tech.name}
          />
        ))
      ) : type == "user" ? (
        <p className={classes.message}>
          Dodajte tehnologije da bi freelanceri lakse pronasli posao
        </p>
      ) : (
        <p className={classes.message}>
          Dodajte tehnologije da bi vas poslodavci lakse pronasli
        </p>
      )}
    </Box>
  );

};
const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  technologiesByUserId: state.technologiesReducer.technologiesByUserId,
  technologiesByJobId: state.technologiesReducer.technologiesByJobId,
});
const mapDispatchToProps = {
  //   getLoggedUser: userActions.getLoggedUser,
  //   getUsersTechnologies: techtnologyActions.fetchByUserId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProfileChosenTechnologies));
