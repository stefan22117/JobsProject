import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  Grid,
  OutlinedInput,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";

import * as chargeActions from "../redux/actions/chargeActions";

const styles = (theme) => ({
  root: {
    backgroundColor: "#adefd1",
    marginBottom: 20,

    display: "flex",
    padding: 5,
  },
  checkBox: {
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "& .MuiTypography-root": {
      color: "#00203f",
    },
    flex: 0.1,
  },
  search: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
      height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
  },
  statusRoot: {
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",

    "& label.MuiFormLabel-root": {
      color: "#00203f",
      marginLeft: "10px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
    },
  },
  selectMenuItem: {
    "&:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
    overflowY: "hidden",
    backgroundColor: "#00203f",
    color: "#adefd1",
  },
});

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
const SearchChargeOrders = ({ user, classes, ...props }) => {
  const [connection, setConnection] = useState();

  const buildConnection = () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44311/hubs/chat")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  };

  const startConnection = (userId) => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");
          connection.on(
            "PostingChargeOrder",

            () => {
              Promise.resolve(
                (async () => {
                  props.searchCharges(searchOptions);
                  props.updateAdminChargesNumber(user.id);
                })()
              );
            }
          );
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
    console.log("conected", connection);
  };

  useEffect(() => {
    buildConnection();
  }, []);

  useEffect(() => {
    props.searchCharges(searchOptions);
    if (user.id && connection) {
      startConnection(user.id);
    }
  }, [user, connection]);

  const [searchOptions, setSearchOptions] = useState({
    status: "all",
    searchWord: "",
  });
  useEffect(() => {
    props.searchCharges(searchOptions);
  }, [searchOptions]);

  const handleChangeStatus = (e) => {
    setSearchOptions({ ...searchOptions, status: e.target.value });
  };
  const handleSearchWord = (e) => {
    setSearchOptions({ ...searchOptions, searchWord: e.target.value });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item md={6} sm={12} xs={12}>
        <Paper className={classes.root}>
          <Grid container spacing={1}>
            <Grid item md={6} sm={12} xs={12}>
              <FormControl className={classes.statusRoot}>
                <InputLabel
                >
                  Status
                </InputLabel>
                <Select
                  value={searchOptions.status}
                  onChange={handleChangeStatus}
                  input={
                    <OutlinedInput
                      label="Status"
                    />
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem className={classes.selectMenuItem} value={"all"}>
                    All
                  </MenuItem>
                  <MenuItem
                    className={classes.selectMenuItem}
                    value={"pending"}
                  >
                    Pending
                  </MenuItem>
                  <MenuItem
                    className={classes.selectMenuItem}
                    value={"accepted"}
                  >
                    Accepted
                  </MenuItem>
                  <MenuItem
                    className={classes.selectMenuItem}
                    value={"declined"}
                  >
                    Declined
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                className={classes.search}
                variant="outlined"
                placeholder={"search..."}
                value={searchOptions.searchWord}
                onChange={handleSearchWord}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  chargeList: state.chargesReducer.list,
});

const mapDispatchToProps = {
  getAllCharges: chargeActions.fetchAll,
  searchCharges: chargeActions.searchCharges,

  updateAdminChargesNumber: chargeActions.updateAdminChargesNumber,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchChargeOrders));
