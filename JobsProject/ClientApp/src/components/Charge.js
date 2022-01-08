import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { toast } from "react-hot-toast";
import * as userActions from "../redux/actions/userActions";
import * as chargeActions from "../redux/actions/chargeActions";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Check, Clear, CloudUpload, Replay } from "@material-ui/icons";
import * as valuteActions from "../redux/actions/valuteActions";
import ChargeOrderList from "./ChargeOrderList";

//con??

const stylesHelper = {
  input: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
      height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    background: "linear-gradient(270deg, #00203f, #adefd1)",
    borderRadius: 5,
    flex: 0.5,
    marginBottom: 5,
  },
};

const styles = (theme) => ({
  root: {
    background: "linear-gradient(180deg, transparent, #adefd1)",
    marginBottom: 20,

    display: "flex",
    padding: 5,
    // width: "50vw",
  },
  importFileButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
  submitChargeButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },

  input: stylesHelper.input,
  minMaxInput: {
    ...stylesHelper.input,
    width: "100%",
    "& .MuiInputBase-root": {
      color: "#adefd1",
      direction: "rtl",
    },
  },
  formHeader: {
    textAlign: "center",
    color: "#adefd1",
  },
  adornmentVisibility: {
    color: "#adefd1",
  },
  error: {
    // color: "#00203f",
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
  selectValutesRoot: {
    color: "#00203f",
    background: "linear-gradient(270deg, #00203f, #adefd1)",
    borderRadius: 5,
    width: "100%",
    "& label.MuiFormLabel-root": {
      color: "#00203f",
      marginLeft: "10px",
    },
    "& .MuiSelect-icon": {
      color: "#adefd1",
    },

    "&.MuiOutlinedInput-root": {
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
  radioButton: {
    "& .MuiSvgIcon-root, .MuiTypography-root": {
      color: "#adefd1",
    },
    "& .Mui-checked": {
      color: "#00203f",
    },
  },
  formLabel: {
    color: "#adefd1",
    "&.Mui-focused": {
      color: "#adefd1",
    },
  },
  chargeInfo: {
    textAlign: "end",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
    color: "#adefd1",
  },
  chargeOrderFrame: {
    padding: 5,
    borderRadius: 5,
    background: "linear-gradient(0deg, #00203f, #adefd1)",
  },
  chargeOrderGrid: {
    justifyContent: "center",
    // justifyContent: "flex-end",
    // [theme.breakpoints.down("sm")]: {
    //   justifyContent: "center",
    // },
  },
  grid: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "50%",
    },
  },
  mainGrid: {
    height: "200px",
    [theme.breakpoints.down("sm")]: {
      height: "400px",
    },
  },
  error: {
    // color:"00203f",
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
  boxError1: {
    width: "100%",
    textAlign: "center",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  boxError2: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
});
//con??

const Charge = ({ user, classes, ...props }) => {
  const [connection, setConnection] = useState();

  const buildConnection = () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44311/hubs/chat") //5001
      .configureLogging(LogLevel.Information) //??logging
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
          connection.on("HandleChargeOrder", (charges) => {
            Promise.resolve(
              (async () => {
                //svima se salje
                props.getChargesByUserId(userId);
                props.getUncheckedCharges(userId);
                props.getLoggedUser();
              })()
            );
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
    console.log("conected", connection);
  };

  const [valuteList, setValuteList] = useState([]);

  const [valute, setValute] = useState({id:0});
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    buildConnection();
    props.getAllValutes().then((res) => {
      setValuteList(res);
    });
  }, []);

  useEffect(() => {
    user.id && props.getChargesByUserId(user.id);

    if (user.id && connection) {
      startConnection(user.id);
    }
  }, [user, connection]);

  const [chargeOrder, setChargeOrder] = useState({ amount: 0 });

  const refChargeOrder = useRef();
  const refChargeOrderInput = useRef();

  const chargeOrderChangeHandler = (e) => {
    const [file] = e.target.files;
    if (file) {
      refChargeOrder.current.src = URL.createObjectURL(file);
      setChargeOrder({ ...chargeOrder, chargeOrderImage: file });
    }
  };

  const validate = (chargeOrder) => {
    let errorsTemp = [];
    if (!valute.id) {
      errorsTemp = [...errorsTemp, { valuteId: "Please, select valute" }];
    }

    if (
      !/^[1-9]+[0-9]*$/.test(chargeOrder.amount) ||
      /^([1-9]+[0-9]*)\.[0-9]*$/.test(chargeOrder.amount)
    ) {
      if (!/^[1-9]+[0-9]*$/.test(chargeOrder.amount)) {
        errorsTemp = [
          ...errorsTemp,
          { amount: "Invalid number for charge amount" },
        ];
      }

      if (/^([1-9]+[0-9]*)\.[0-9]*$/.test(chargeOrder.amount)) {
        errorsTemp = [...errorsTemp, { amount: "Use whole numbers" }];
      }
    }

    if (!refChargeOrderInput.current.value) {
      errorsTemp = [
        ...errorsTemp,
        { chargeOrder: "Please upload charge order" },
      ];
    }

    setErrors(errorsTemp);
    return !errorsTemp.length;
  };

  const submitCharge = async (e) => {
    e.preventDefault();

    if (!validate(chargeOrder)) {
      toast.error("Please, insert valid data");
      return false;
    }

    chargeOrder.valuteId = valute.id;

    let formNewCharge = new FormData();
    formNewCharge.append("userId", user.id);
    Object.keys(chargeOrder).forEach((key) => {
      formNewCharge.append(key, chargeOrder[key]);
    });

    await props.createCharge(formNewCharge);

    toast.success("You have successfully submitted a payment request");

    await props.getLoggedUser();
    setChargeOrder({ amount: 0, chargeOrderImage: null });
    setValute({id: 0});
    refChargeOrderInput.current.value = null;
    refChargeOrder.current.src = "/media/nalog_za_uplatu_prazan.jfif";
  };

  const handleChangeAmount = (e) => {
    let newValue = e.target.value;
    if (newValue < 0) {
      newValue = 0;
    }
    setChargeOrder({ ...chargeOrder, amount: newValue });
  };

  const handleChangeValute = (e) => {

    props.getValuteById(e.target.value).then((res) => {
      setValute(res);
    });
  };
  return (
    <>
      <form onSubmit={submitCharge}>
        <Paper elevation={2} className={classes.root}>
          <Grid container>
            <Grid item md={12} sm={12} xs={12}>
              <h3 className={classes.formHeader}>New Charge</h3>
            </Grid>

            <Grid item md={6} sm={12}>
              <p className={classes.chargeInfo}>For: Jobs d.o.o.</p>
              <p className={classes.chargeInfo}>Purpose: Tech service</p>
              <p className={classes.chargeInfo}>
                Bank Account: 2003223213213213321
              </p>
            </Grid>

            <Grid
              md={6}
              sm={12}
              item
              container
              justifyContent="center"
              alignItems="center"
            >
              <Grid container item md={12} sm={12} justifyContent="center">
                <Grid item md={8} sm={12}>
                  <FormControl
                    variant="outlined"
                    style={{
                      marginBottom: 5,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Grid container>
                      <Grid
                        item
                        md={3}
                        container
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FormLabel className={classes.formLabel}>
                          Valute
                        </FormLabel>
                      </Grid>
                      <Grid item md={9} sm={12}>
                        <Select
                          error={errors.filter((x) => x.valuteId).length > 0}
                          className={classes.selectValutesRoot}
                          name="valuteId"
                          value={valute?.id}
                          onChange={handleChangeValute}
                        >
                          <MenuItem
                            className={classes.selectMenuItem}
                            value="0"
                          >
                            Select Valute
                          </MenuItem>
                          {valuteList.map((valute) => (
                            <MenuItem
                              className={classes.selectMenuItem}
                              value={valute.id}
                              key={valute.id}
                            >
                              {valute.namePlural} - {valute.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      {/* <Grid item md={12} sm={12}>
                        {errors
                          .filter((x) => x.valuteId)
                          .map((e) => (
                            <FormHelperText className={classes.error}>
                              {e.valuteId}
                            </FormHelperText>
                          ))}
                      </Grid> */}
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12}>
                {errors
                  .filter((x) => x.valuteId)
                  .map((e) => (
                    <FormHelperText className={classes.error}>
                      {e.valuteId}
                    </FormHelperText>
                  ))}
              </Grid>

              <Grid container item md={12} sm={12} justifyContent="center">
                <Grid item md={8} sm={12}>
                  <FormControl
                    style={{
                      marginBottom: 5,
                      width:'100%',
                      height:'100%'
                    }}
                  >
                    <Grid container>
                      <Grid
                        item
                        md={3}
                        sm={12}
                        container
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FormLabel className={classes.formLabel}>
                          Amount
                        </FormLabel>
                      </Grid>
                      <Grid item md={9} sm={12}>
                        <TextField
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                          className={classes.input}
                          variant="outlined"
                          type="number"
                          value={chargeOrder.amount}
                          onChange={handleChangeAmount}
                          error={errors.filter((x) => x.amount).length > 0}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12}>
                {errors
                  .filter((x) => x.amount)
                  .map((e) => (
                    <FormHelperText className={classes.error}>
                      {e.amount}
                    </FormHelperText>
                  ))}
              </Grid>
            </Grid>

            <Grid container justifyContent="center" alignItems="center">
              <Grid
                item
                md={3}
                style={{
                  textAlign: "end",
                }}
              >
                <IconButton
                  className={classes.importFileButton}
                  onClick={() => {
                    setChargeOrder({ chargeOrderImage: null });
                    refChargeOrderInput.current.value = null;
                    refChargeOrder.current.src =
                      "/media/nalog_za_uplatu_prazan.jfif";
                  }}
                >
                  <Replay />
                </IconButton>
              </Grid>
              <Grid md={6} item container alignItems="center">
                <Grid
                  item
                  container
                  md={12}
                  className={classes.chargeOrderGrid}
                >
                  <Grid
                    className={classes.chargeOrderFrame}
                    style={{
                      background: errors.filter((x) => x.chargeOrder).length
                        ? "linear-gradient(0deg, red, #adefd1)"
                        : "linear-gradient(0deg, #00203f, #adefd1)",
                    }}
                  >
                    <img
                      width={"400px"}
                      height={"180px"}
                      src={"/media/nalog_za_uplatu_prazan.jfif"}
                      ref={refChargeOrder}
                      onClick={() => refChargeOrderInput.current.click()}
                    />
                  </Grid>
                </Grid>

                <input
                  ref={refChargeOrderInput}
                  onChange={chargeOrderChangeHandler}
                  type="file"
                  style={{ display: "none" }}
                />
              </Grid>
              <Grid item md={3}>
                <IconButton
                  className={classes.importFileButton}
                  onClick={() => refChargeOrderInput.current.click()}
                >
                  <CloudUpload />
                </IconButton>
              </Grid>
              <Grid item md={12}>
                {errors
                  .filter((x) => x.chargeOrder)
                  .map((e) => (
                    <FormHelperText className={classes.error}>
                      {e.chargeOrder}
                    </FormHelperText>
                  ))}
              </Grid>
            </Grid>

            <Grid item md={12} container justifyContent="center">
              <Button className={classes.submitChargeButton} type="submit">
                Submit charge
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>

      <ChargeOrderList
        chargeOrder={chargeOrder}
        setChargeOrder={setChargeOrder}
        valute={valute}
        setValute={setValute}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  // chargeList: state.chargesReducer.list,
});

const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getUncheckedCharges: chargeActions.getUncheckedCharges,
  getChargesByUserId: chargeActions.fetchAllByUserId,
  createCharge: chargeActions.createCharge,
  checkCharge: chargeActions.checkCharge,
  getAllValutes: valuteActions.fetchAll,
  getValuteById: valuteActions.fetchById,
  // technologiesByJobId: technologyActions.fetchByJobId,
  // bidsByJobId: bidActions.fetchByJobId,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Charge));
