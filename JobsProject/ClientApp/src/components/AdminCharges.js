import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Tooltip, Grid, IconButton, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import mediumZoom from "medium-zoom";
import * as userActions from "../redux/actions/userActions";
import * as chargeActions from "../redux/actions/chargeActions";
import SearchChargeOrders from "./SearchChargeOrders";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"; //???????
import {
  Visibility,
  Check,
  Clear,
  CheckCircle,
  HighlightOffOutlined,
  ArrowDropUp,
  ArrowDropDown,
  ThumbDown,
  ThumbUp,
} from "@material-ui/icons";
import PendingIcon from "./PendingIcon";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
const styles = (theme) => ({
  chargeOrderRow: {},
  chargeOrderColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const AdminCharges = ({ user, classes, ...props }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  if (user.role != "admin") {
    history.push("/");
  }

  useEffect(() => {
    props.getAllCharges();
  }, [user]);

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

  const handleAccept = async (id) => {
    await props.acceptCharge(id);
    let ids = [...props.chargeList.map((x) => x.id)];
    await props.refreshCharges(ids);
    await props.updateAdminChargesNumber(user.id);
    toast("You have successfull accepted charge order", {
      icon: <ThumbUp />,
    });
  };
  const handleDecline = async (id) => {
    await props.declineCharge(id);
    let ids = [...props.chargeList.map((x) => x.id)];
    await props.refreshCharges(ids);
    await props.updateAdminChargesNumber(user.id);
    toast("You have successfull declined charge order", {
      icon: <ThumbDown />,
    });
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

  const [chargeList, setChargeList] = useState([]);
  const [dateTimeArrow, setDateTimeArrow] = useState(false);
  useEffect(() => {
    if (dateTimeArrow) {
      setChargeList(props.chargeList);
    } else {
      setChargeList([...props.chargeList].reverse());
    }
  }, [props.chargeList]);

  const sortChargesByDateTime = () => {
    setChargeList([...chargeList].reverse());
    setDateTimeArrow(!dateTimeArrow);
  };

  return (
    <>
      <SearchChargeOrders />

      {
        chargeList.length
      ? (
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
            <Grid item md={2} sm={2} xs={2}>
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
            <Grid item md={1} sm={1} xs={1}>
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
            <Grid item md={2} sm={2} xs={2}>
              <Typography
                variant="h6"
                noWrap
                align="center"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              >
                User
              </Typography>
            </Grid>
            <Grid item md={2} sm={2} xs={2}>
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
            <Grid
              item
              md={3}
              sm={3}
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
            <Grid item md={2} sm={2} xs={2}>
              <Typography
                variant="h6"
                noWrap
                align="center"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              >
                Actions
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
                    c.status != "pending" ? "#adefd1" : "#00203f",
                }}
              >
                <Grid
                  className={classes.chargeOrderColumn}
                  item
                  md={2}
                  sm={2}
                  xs={2}
                  style={{
                    color: c.status != "pending" ? "#00203f" : "#adefd1",
                  }}
                >
                  <span>{c.amount}</span>
                </Grid>

                <Grid className={classes.chargeOrderColumn} item md={1} sm={1}>
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
                <Grid className={classes.chargeOrderColumn} item md={2} sm={2} xs={2}>
                  <span>
                    <Link
                      to={"/freelancers/" + c?.user?.id}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: c.status != "pending" ? "#00203f" : "#adefd1",
                      }}
                    >
                      {c?.user?.name}
                    </Link>
                  </span>
                </Grid>
                <Grid className={classes.chargeOrderColumn} item md={2} sm={2} xs={2}>
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
                          color: c.status != "pending" ? "#00203f" : "#adefd1",
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
                  sm={3}
                  xs={3}
                  style={{
                    color: c.status != "pending" ? "#00203f" : "#adefd1",
                  }}
                >
                  {formatChargeDate(c.createdDateTime)}
                </Grid>
                <Grid
                  className={classes.chargeOrderColumn}
                  item
                  md={2}
                  sm={2}
                  xs={2}
                  style={{
                    color: c.status != "pending" ? "#00203f" : "#adefd1",
                    visibility: c.status == "pending" ? "visible" : "hidden",
                  }}
                >
                  <>
                    <Grid container justifyContent="center" item md={6}>
                      <IconButton
                        onClick={() => handleAccept(c.id)}
                        style={{
                          padding: 0,
                        }}
                      >
                        <CheckCircle
                          style={{
                            color: "green",
                          }}
                        />
                      </IconButton>
                    </Grid>

                    <Grid container justifyContent="center" item md={6}>
                      <IconButton
                        onClick={() => handleDecline(c.id)}
                        style={{
                          padding: 0,
                        }}
                      >
                        <HighlightOffOutlined
                          style={{
                            color: "red",
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Grid item md={12} sm={12} container justifyContent="center">
          <Grid item md={8} sm={8}>
          <Typography
            variant="h6"
            style={{
              backgroundColor: "#adefd1",
              color: "#00203f",
              borderRadius: 5,
              textAlign: "center",
            }}
            >
            No one has charged the money so far
          </Typography>
          </Grid>
        </Grid>

      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  chargeList: state.chargesReducer.list,
});

const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getAllCharges: chargeActions.fetchAll,
  getChargesByUserId: chargeActions.fetchAllByUserId,
  acceptCharge: chargeActions.accept,
  declineCharge: chargeActions.decline,
  refreshCharges: chargeActions.refresh,
  updateAdminChargesNumber: chargeActions.updateAdminChargesNumber,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminCharges));
