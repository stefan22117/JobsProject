//za technologies
import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip} from "@material-ui/core";

import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import * as technologyActions from "../redux/actions/technologyActions";
import { jobsActionTypes } from "../redux/reducers/actionTypes";

const styles = (theme) => ({
  root: {
    backgroundColor:'white',
    borderRadius:5,
    flex:0.4,
    
    '& label.MuiFormLabel-root': {
      color: '#00203f',
      marginLeft:'10px'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
        borderColor: '#00203f',
      },
    }
  },
  menuItem: {
    '&:hover':{
      backgroundColor: "#adefd1",
      color: "#00203f"

    },
    '&.Mui-selected, &.Mui-selected:hover':{
      backgroundColor: "#adefd1",
    color: "#00203f"
    },
    overflowY: 'hidden', 
    backgroundColor: "#00203f",
    color: "#adefd1"
  },
  selectedChip:{
    backgroundColor: "#00203f",
    color: "#adefd1"

  }
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectTechnologies = ({ technologies, setTechnologies, classes, ...props }) => {
 

  useEffect(() => {
    props.allTechnologies();
    setTechnologies(technologies.map((x) => x.id));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setTechnologies(typeof value === "string" ? value.split(",") : value);
  };

  return (
      <FormControl className={classes.root}>
        <InputLabel id="demo-multiple-chip-label">Technologies</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={technologies}
          onChange={handleChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Technologies" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  className={classes.selectedChip}
                  key={value}
                  label={
                    props.technologiesList.filter((x) => x.id == value)[0]?.name
                  }
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {props.technologiesList.map((technology) => (
            <MenuItem
              key={technology.id}
              value={technology.id}
              className={classes.menuItem}
            >
              {technology.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
};
const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  technologiesList: state.technologiesReducer.list,
});

const mapDispatchToProps = {
  allTechnologies: technologyActions.fetchAll,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectTechnologies));
