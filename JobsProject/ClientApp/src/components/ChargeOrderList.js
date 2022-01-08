import {
  Grid,
  IconButton,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp, Check, Clear, Visibility } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PendingIcon from "./PendingIcon";
import * as chargeActions from "../redux/actions/chargeActions";
import mediumZoom from "medium-zoom";
const styles = (theme) => ({
  chargeOrderRow: {},
  chargeOrderColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const ChargeOrderList = ({chargeOrder, setChargeOrder,valute,setValute, classes, ...props }) => {
  const handleImageZoom = (e, id) => {
    const zoom = mediumZoom(".imgChargeOrderMediumZoom-" + id);
    zoom.on("open", (e) => {
      e.target.style.display = "inline";
    });
    zoom.on("close", (e) => {
      e.target.style.display = "none";
    });
    zoom.open();
  };
  const handleCheckMoneyCharge = async (charge) => {
    if (charge.checked || charge.status == "pending") {
      return;
    } else {
      await props.checkCharge(charge.id);
      await props.getUncheckedCharges(charge.userId);
    }
  };
  const formatChargeDate = (dateStr) => {
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

  const amountHandleClick = (amount) => {
    setChargeOrder({...chargeOrder, amount: amount})
  };
  const valuteHandleClick = (valute) => {
    setValute(valute)
  };
  const [chargeList, setChargeList] = useState([]);
  const [dateTimeArrow, setDateTimeArrow] = useState(false);
  useEffect(() => {
    if(dateTimeArrow){
      setChargeList(props.chargeList);
    }
    else{
      setChargeList([...props.chargeList].reverse());
    }
  }, [props.chargeList]);

  const sortChargesByDateTime = () => {
    setChargeList([...chargeList].reverse());
    setDateTimeArrow(!dateTimeArrow);
  };


  return (
    <>
      {chargeList.length ? (
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
            <Grid item md={2}>
              <Typography
                variant="h6"
                noWrap
                align="center"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              >
                Status
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
                Charge Orders
              </Typography>
            </Grid>
            <Grid item md={3}
            style={{
              cursor: "pointer",
            }}
            onClick={sortChargesByDateTime}
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
            {chargeList.map((c, i) => (
              <Grid
                item
                container
                md={12}
                key={i}
                style={{
                  marginTop: 5,
                  backgroundColor:
                    !c.checked && c.status != "pending" ? "#00203f" : "#adefd1",

                  cursor: !c.checked && c.status != "pending" ? "pointer" : "",
                }}
                onClick={() => handleCheckMoneyCharge(c)}
              >
                <Grid
                  className={classes.chargeOrderColumn}
                  item
                  md={3}
                  onClick={()=>amountHandleClick(c.amount)}
                  style={{
                    color:
                      !c.checked && c.status != "pending"
                        ? "#adefd1"
                        : "#00203f",
                        cursor:'pointer'
                  }}
                >
                  <span>{c.amount}</span>
                </Grid>
                <Grid
                  className={classes.chargeOrderColumn}
                  item
                  md={2}
                  onClick={()=>valuteHandleClick(c?.valute)}
                  style={{
                    color:
                      !c.checked && c.status != "pending"
                        ? "#adefd1"
                        : "#00203f",
                        cursor:'pointer'
                  }}
                >
                  <span>{c?.valute?.namePlural}</span>
                </Grid>

                <Grid className={classes.chargeOrderColumn} item md={2}>
                  <span
                    style={{
                      color:
                        c.status == "accepted"
                          ? "green"
                          : c.status == "pending"
                          ? "yellow"
                          : "red",
                    }}
                  >
                    {c.status == "accepted" ? (
                      <Tooltip title="Accepted">
                        <Check />
                      </Tooltip>
                    ) : c.status == "pending" ? (
                      <Tooltip title="Pending">
                        <span>
                          <PendingIcon />
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Declined">
                        <Clear />
                      </Tooltip>
                    )}
                  </span>
                </Grid>
                <Grid className={classes.chargeOrderColumn} item md={2}>
                  <span
                    style={{
                      color:
                        c.status == "accepted"
                          ? "green"
                          : c.status == "pending"
                          ? "yellow"
                          : "red",
                    }}
                  >
                    <IconButton
                      style={{
                        padding: 5,
                      }}
                      onClick={(e) => handleImageZoom(e, c.id)}
                    >
                      <Visibility
                        style={{
                          color:
                            !c.checked && c.status != "pending"
                              ? "#adefd1"
                              : "#00203f",
                        }}
                      />
                      <img
                        style={{ display: "none", position: "absolute" }}
                        width={10}
                        height={10}
                        className={"imgChargeOrderMediumZoom-" + c.id}
                        src={"/media/chargeOrderImages/" + c.imagePath}
                      />
                    </IconButton>
                  </span>
                </Grid>
                <Grid
                  className={classes.chargeOrderColumn}
                  item
                  md={3}
                  style={{
                    color:
                      !c.checked && c.status != "pending"
                        ? "#adefd1"
                        : "#00203f",
                  }}
                >
                  {formatChargeDate(c.createdDateTime)}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <p>Niste uplatili novac do sada</p>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  chargeList: state.chargesReducer.list,
});

const mapDispatchToProps = {
  // getLoggedUser: userActions.getLoggedUser,
  getUncheckedCharges: chargeActions.getUncheckedCharges,
  // getChargesByUserId: chargeActions.fetchAllByUserId,
  // createCharge: chargeActions.createCharge,
  checkCharge: chargeActions.checkCharge,
  // technologiesByJobId: technologyActions.fetchByJobId,
  // bidsByJobId: bidActions.fetchByJobId,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChargeOrderList));
