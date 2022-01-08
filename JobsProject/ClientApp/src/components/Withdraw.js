import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  ArrowDropDown,
  ArrowDropUp,
} from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-hot-toast";
import * as userActions from "../redux/actions/userActions";
import * as valuteActions from "../redux/actions/valuteActions";
const styles = (theme) => ({
  root: {
    background: "linear-gradient(180deg, transparent, #adefd1)",
    marginBottom: 20,

    display: "flex",
    padding: 5,
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
    marginBottom: 5,
  },

  bankAccountInput: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
      height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    "& .MuiInputBase-root input": {
      textAlign:'center'
    },
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
    marginBottom: 5,
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
    // height: "100%", //??
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
  slider: {
    height: 30,
    width: "100%",
    padding: 0,
    borderRadius: 5,
    border: "1px solid #00203f",
    width: "80%",
    // background: "linear-gradient(270deg, #00203f, #adefd1)",
    backgroundColor: "#adefd1",
    "& .MuiSlider-rail": {
      background: "transparent",
      height: "100%",
    },
    "& .MuiSlider-track": {
      background: "linear-gradient(270deg, #00203f, #adefd1)",
      // backgroundColor: "#00203f",
      borderRadius: 5,
      height: "100%",
    },
    "& .MuiSlider-thumb": {
      height: "100%",
      color: "#00203f",
      display: "none",
      borderRadious: 0,

      // "&::after":{

      // }
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
  bilanceParagraph: {
    fontSize: "2rem",
    color: "#adefd1",
    textAlign: "center",
  },
  chargeOrderColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Withdraw = ({ user, classes, ...props }) => {
  const initialWithdraw = {
    userId: 0,
    amount: 0,
    valuteId: 0,
  };
  const initialBankAccount = {
    first3: "",
    second13: "",
    third2: "",
  };
  const [withdraw, setWithdraw] = useState(initialWithdraw);
  const [bankAccount, setBankAccount] = useState(initialBankAccount);
  const [withdrawList, setWithdrawList] = useState([]);
  const [total, setTotal] = useState(0);
  const [valute, setValute] = useState({ id: 0 });

  const [valuteList, setValuteList] = useState([]);
  useEffect(() => {
    props.getAllValutes().then((res) => {
      setValuteList(res);
    });
  }, []);

  useEffect(() => {
    setWithdraw({ ...withdraw, valuteId: user.valuteId });

    if (!valute?.id) {
      setValute(user.valute);
    }

    Promise.resolve(
      (async () => {
        if (!user.id) {
          return;
        }
        const result = await axios.get(
          "api/withdrawMoney/byLastUserId/" + user.id
        );
        if (result.data) {
          setBankAccount({
            first3: result.data.bankAccount.slice(0, 3) ?? "",
            second13: result.data.bankAccount.slice(3, 16) ?? "",
            third2: result.data.bankAccount.slice(16, 18) ?? "",
          });

          const result2 = await axios.get(
            "api/withdrawMoney/byUserId/" + user.id
          );
          if (result2.data) {
            if(dateTimeArrow){
              setWithdrawList(result2.data);
            }
            else{
              setWithdrawList([...result2.data].reverse());
            }
          }
        }
      })()
    );
  }, [user]);

  useEffect(() => {
    let t = 0;
    if (valute?.id) {
      t = user.total * valute.toDinars;
      setTotal(t);
    } else if (user.id) {
      t = user.total * user?.valute?.toDinars;
      setTotal(t);
    }
  }, [user, valute]);

  const bankAccountChange = (e) => {
    switch (e.target.name) {
      case "first3":
        if (e.target.value.length > 3) {
          return;
        }
        break;
      case "second13":
        if (e.target.value.length > 13) {
          return;
        }
        break;
      case "third2":
        if (e.target.value.length > 2) {
          return;
        }
        break;
    }
    setBankAccount({
      ...bankAccount,
      [e.target.name]: e.target.value,
    });
  };

  const sliderChange = (event, newValue) => {
    setWithdraw({ ...withdraw, amount: newValue });
  };

  const validate = () => {
    let errorsTemp = [];

    if (!valute.id) {
      errorsTemp = [...errorsTemp, { valuteId: "Please, select valute" }];
    }

    if (!/^([1-9]+)([0-9]*)(\.[0-9]{1,2}){0,1}$/.test(withdraw.amount)) {
      errorsTemp = [...errorsTemp, { amount: "Invalid number for amount" }];
    }

    let invalidBankAccount = false;
    if (!/^([0-9]{3})$/.test(bankAccount.first3)) {
      errorsTemp = [
        ...errorsTemp,
        { bankAccount3: "First 3 numbers are not valid" },
      ];
      invalidBankAccount = true;
    }

    if (!/^([0-9]{13})$/.test(bankAccount.second13)) {
      errorsTemp = [
        ...errorsTemp,
        { bankAccount13: "Second 13 numbers are not valid" },
      ];
      invalidBankAccount = true;
    }

    if (!/^([0-9]{2})$/.test(bankAccount.third2)) {
      errorsTemp = [
        ...errorsTemp,
        { bankAccount2: "Third 2 numbers are not valid" },
      ];
      invalidBankAccount = true;
    }

    if (invalidBankAccount) {
      errorsTemp = [
        ...errorsTemp,
        { bankAccount: "Bank account is not valid" },
      ];
    }

    setErrors(errorsTemp);
    return !errorsTemp.length;
  };

  const submitWithdraw = async (e) => {
    e.preventDefault();

    if (!user.id) {
      toast.error("You are not logged in");
      return;
    }

    if (!validate()) {
      return;
    }

    if (user.total < withdraw.amount / valute.toDinars) {
      toast.error(
        "The maximum value you can raise is " +
          ((total + "").indexOf(".") != -1
            ? (total + "").slice(0, (total + "").indexOf(".") + 3)
            : total) +
          " " +
          valute?.label
      );
      return;
    }

    const bankAccountString =
      "" + bankAccount.first3 + bankAccount.second13 + bankAccount.third2;
    const newWithdraw = {
      userId: user.id,
      amount: withdraw.amount,
      bankAccount: bankAccountString,
      valuteId: valute.id,
    };
    await axios.post("api/withdrawMoney", newWithdraw);

    toast.success(
      "You have successfully raised " +
        ((withdraw.amount + "").indexOf(".") != -1
          ? (withdraw.amount + "").slice(
              0,
              (withdraw.amount + "").indexOf(".") + 3
            )
          : withdraw.amount) +
        " " +
        valute?.namePlural
    );
    await props.getLoggedUser();
    setWithdraw({ ...withdraw, amount: 0 });
  };
  const [errors, setErrors] = useState([]);

  const handleChangeAmount = (e) => {
    if (e.target.value <= total) {
      setWithdraw({ ...withdraw, amount: e.target.value });
    }
  };

  const handleChangeValute = (e) => {
    setWithdraw({ ...withdraw, amount: 0 });

    props.getValuteById(e.target.value).then((res) => {
      setValute(res);
    });
  };

  const valuteHandleClick = (valute) => {
    if (valute.id) {
      setWithdraw({ ...withdraw, amount: withdraw.amount * valute.toDinars });
      setValute(valute);
    }
  };

  const amountHandleClick = (amount, valute) => {
    if (valute.id) {
      setValute(valute);
      setWithdraw({ ...withdraw, amount: amount });
    }
  };
  const bankAccountHandleClick = (bankAccount) => {
    setBankAccount({
      first3: bankAccount.slice(0, 3) ?? "",
      second13: bankAccount.slice(3, 16) ?? "",
      third2: bankAccount.slice(16, 18) ?? "",
    });
  };

  const formatWithdrawDate = (dateStr) => {
    const date = new Date(dateStr);
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    const [hour, minutes] = [
      date.getHours(),
      date.getMinutes(),
      // date.getSeconds(),
    ];

    return `${hour < 10 ? "0" + hour : hour}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${day}/${month + 1}/${year}`;
  };

  const [dateTimeArrow, setDateTimeArrow] = useState(false);
  const sortWithdrawsByDateTime = () => {
    setWithdrawList([...withdrawList].reverse());
    setDateTimeArrow(!dateTimeArrow);
  };
  return (
    <div>
      <form onSubmit={submitWithdraw}>
        <Paper elevation={2} className={classes.root}>
          <Grid container>
            <Grid item md={12} sm={12} xs={12}>
              <h3 className={classes.formHeader}>New Withdraw</h3>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <p className={classes.bilanceParagraph}>
                Your bilance:{" "}
                {(total + "").indexOf(".") != -1
                  ? (total + "").slice(0, (total + "").indexOf(".") + 3)
                  : total}{" "}
                {valute?.label}{" "}
              </p>
            </Grid>

            <Grid item md={12} sm={12} container justifyContent="center">
              <Grid item container md={8} sm={12}>
                <Grid item md={6} sm={12} xs={12}>
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
                      <Grid item md={9} sm={12} xs={12}>
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

                      <Grid item md={12} sm={12}>
                        {errors
                          .filter((x) => x.valuteId)
                          .map((e) => (
                            <FormHelperText className={classes.error}>
                              {e.valuteId}
                            </FormHelperText>
                          ))}
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  xs={12}
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <FormControl
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
                        sm={12}
                        container
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FormLabel className={classes.formLabel}>
                          Amount
                        </FormLabel>
                      </Grid>
                      <Grid item md={9} sm={12} xs={12}>
                        <TextField
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                          className={classes.input}
                          variant="outlined"
                          type="number"
                          value={withdraw.amount}
                          onChange={handleChangeAmount}
                          error={errors.filter((x) => x.amount).length > 0}
                        />
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
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              item
              md={12}
              sm={12}
              xs={12}
              container
              justifyContent="center"
            >
              <Grid item md={8} sm={12} xs={12}>
                <Slider
                  style={{
                    width: "100%",
                  }}
                  className={classes.slider}
                  min={0}
                  max={
                    new Number(
                      (total + "").indexOf(".") != -1
                        ? (total + "").slice(0, (total + "").indexOf(".") + 3)
                        : total
                    ) + 0
                  }
                  value={new Number(withdraw.amount) + 0}
                  onChange={sliderChange}
                ></Slider>
              </Grid>
            </Grid>

            <Grid
              container
              item
              md={12}
              sm={12}
              container
              justifyContent="center"
            >
              <Grid item container md={8} sm={12} spacing={1}>
                <Grid item md={2} sm={12} xs={12}>
                  <TextField
                    className={classes.bankAccountInput}
                    variant="outlined"
                    type="text"
                    value={bankAccount.first3}
                    name="first3"
                    onChange={bankAccountChange}
                    error={errors.filter((x) => x.bankAccount3).length > 0}
                  />
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                  <TextField
                    className={classes.bankAccountInput}
                    variant="outlined"
                    type="text"
                    value={bankAccount.second13}
                    name="second13"
                    onChange={bankAccountChange}
                    error={errors.filter((x) => x.bankAccount13).length > 0}
                  />
                </Grid>
                <Grid item md={2} sm={12} xs={12}>
                  <TextField
                    className={classes.bankAccountInput}
                    variant="outlined"
                    type="text"
                    value={bankAccount.third2}
                    name="third2"
                    onChange={bankAccountChange}
                    error={errors.filter((x) => x.bankAccount2).length > 0}
                  />
                </Grid>

                <Grid item md={12} sm={12}>
                  {errors
                    .filter((x) => x.bankAccount3)
                    .map((e) => (
                      <FormHelperText className={classes.error}>
                        {e.bankAccount3}
                      </FormHelperText>
                    ))}
                  {errors
                    .filter((x) => x.bankAccount13)
                    .map((e) => (
                      <FormHelperText className={classes.error}>
                        {e.bankAccount13}
                      </FormHelperText>
                    ))}
                  {errors
                    .filter((x) => x.bankAccount2)
                    .map((e) => (
                      <FormHelperText className={classes.error}>
                        {e.bankAccount2}
                      </FormHelperText>
                    ))}

                  {errors
                    .filter((x) => x.bankAccount)
                    .map((e) => (
                      <FormHelperText className={classes.error}>
                        {e.bankAccount}
                      </FormHelperText>
                    ))}
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} container justifyContent="center">
              <Button className={classes.submitChargeButton} type="submit">
                Withdraw
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <div>
        {withdrawList.length ? (
          <Grid container>
            <Grid
              container
              item
              md={12}
              style={{
                backgroundColor: "#adefd1",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                color: "#00203f",
              }}
            >
              <Grid item md={3}>
                <Typography
                  variant="h6"
                  noWrap
                  align="center"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                >
                  Amount
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography
                  variant="h6"
                  noWrap
                  align="center"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                >
                  Valute
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Typography
                  variant="h6"
                  noWrap
                  align="center"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                >
                  Bank Account
                </Typography>
              </Grid>

              <Grid
                item
                md={3}
                style={{
                  cursor: "pointer",
                }}
                onClick={sortWithdrawsByDateTime}
              >
                <Typography
                  variant="h6"
                  noWrap
                  align="center"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                >
                  Datetime {dateTimeArrow ? <ArrowDropUp /> : <ArrowDropDown />}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              style={{
                background: "linear-gradient(180deg, #00203f, #adefd1)",
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                paddingBottom: 5,
              }}
            >
              {withdrawList.map((w, i) => (
                <Grid
                  item
                  container
                  md={12}
                  key={i}
                  style={{
                    marginTop: 5,
                    backgroundColor: "#adefd1",
                  }}
                >
                  <Grid
                    className={classes.chargeOrderColumn}
                    item
                    md={3}
                    style={{
                      color: "#00203f",
                      cursor: "pointer",
                    }}
                    onClick={() => amountHandleClick(w.amount, w.valute)}
                  >
                    <span>{w.amount}</span>
                  </Grid>
                  <Grid
                    className={classes.chargeOrderColumn}
                    item
                    md={2}
                    onClick={() => valuteHandleClick(w.valute)}
                  >
                    <span
                      style={{
                        color: "#00203f",
                        cursor: "pointer",
                      }}
                    >
                      {w?.valute?.namePlural}
                    </span>
                  </Grid>

                  <Grid
                    className={classes.chargeOrderColumn}
                    item
                    md={4}
                    onClick={() => bankAccountHandleClick(w.bankAccount)}
                  >
                    <span
                      style={{
                        color: "#00203f",
                        cursor: "pointer",
                      }}
                    >
                      {w.bankAccount}
                    </span>
                  </Grid>

                  <Grid
                    className={classes.chargeOrderColumn}
                    item
                    md={3}
                    style={{
                      color: "#00203f",
                    }}
                  >
                    {formatWithdrawDate(w.createdDateTime)}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ) : (
          <p>Niste uplatili novac do sada</p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
});

const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getAllValutes: valuteActions.fetchAll,
  getValuteById: valuteActions.fetchById,
  // getSingleJob: jobActions.findById,
  // technologiesByJobId: technologyActions.fetchByJobId,
  // bidsByJobId: bidActions.fetchByJobId,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Withdraw));
