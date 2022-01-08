import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Clear, Work } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";

import InboxNavItem from "./InboxNavItem";
import AdminChargesNavItem from "./AdminChargesNavItem";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    marginBottom: 10,
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  headerOptions: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
  mobileLink: {
    textAlign: "center",
    cursor: "pointer",
    color: "#00203f",
  },
  mobileSubLink: {
    textAlign: "center",
    cursor: "pointer",
    color: "#00203f",
  },
  subLink: {
    cursor: "pointer",
    textAlign: "center",
    color: "#adefd1",
    marginTop: 5,
    marginBottom: 5,
    "&:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
  },
});

const mobileLinkStyle = {
  textAlign: "center",
  cursor: "pointer",
  color: "#00203f",
};

const links = {
  jobs: [
    {
      label: "Search jobs",
      url: "/",
    },
    {
      label: "Post job",
      url: "/post-job",
    },
    {
      label: "Posted job",
      url: "/posted-jobs",
    },
    {
      label: "Bidded jobs",
      url: "/bidded-jobs",
    },
    {
      label: "Finished jobs",
      url: "/finished-jobs",
    },
  ],
  account: [
    { label: "Profile", url: "/profile" },
    { label: "Withdraw", url: "/withdraw" },
    { label: "Charge", url: "/charge" },
  ],
};


const Header = ({ loggedUser,classes, ...props }) => {


  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const total = loggedUser.total * loggedUser?.valute?.toDinars;

  const clickLogout = () => {
    props.logoutUser();
    setMobileDrawMenu(false);
    history.push("/");
  };

  const goToLink = (url) => {
    closeMobileDrawMenu();
    setJobsMenu(false);
    setAccountMenu(false);
    if (url) {
      history.push(url);
    }
  };

  const [mobileDrawMenu, setMobileDrawMenu] = useState(false);
  const openMobileDrawMenu = () => {
    setMobileDrawMenu(true);
  };
  const closeMobileDrawMenu = () => {
    setMobileDrawMenu(false);
  };

  const SubMobileMenu = ({ subMobileMenu }) => {
    const subMobileRef = useRef();

    useEffect(() => {
      if (subMobileMenu.drawed) {
        subMobileRef.current.style.left = "0";
      } else {
        subMobileRef.current.style.left = "-40%";
      }
    }, []);

    return (
      <div
        ref={subMobileRef}
        style={{
          width: "35vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          //   left: subMobileMenu ? "-110%" : "0",
          left: subMobileMenu.drawed ? "0" : "-40%",
          //   left: "0",
          transition: "all 1s ease-in",
          backgroundColor: "#00203f",
          zIndex: 10,
        }}
      >
        {subMobileMenu.list.length &&
          subMobileMenu.list.map(
            (link, i) =>
              link.label && (
                <Typography
                  key={i}
                  variant="h6"
                  onClick={() => goToLink(link.url)}
                >
                  {link.label}
                </Typography>
              )
          )}

        <Typography
          variant="h6"
          onClick={clickLogout}
        >
          Logout
        </Typography>
      </div>
    );
  };

  const MobileDrawMenu = ({
    mobileDrawMenu,
    closeMobileDrawMenu,
    loggedUser,
  }) => {
    const toogleSubMobileMenu = (list) => {
      if (subMobileMenu.drawed) {
        setSubMobileMenu({ ...subMobileMenu, drawed: false });
      } else {
        setSubMobileMenu({ list: list, drawed: true });
      }
    };

    useEffect(() => {
      if (mobileDrawMenu) {
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "hidden";
        mobileRef.current.style.left = "0";
      } else {
        mobileRef.current.style.left = "-110%";
      }

      return () => {
        document.body.style.overflowX = "auto";
        document.body.style.overflowY = "auto";
        mobileRef.current.style.left = "-110%";
      };
    }, []);

    const [subMobileMenu, setSubMobileMenu] = useState({
      list: [],
      drawed: false,
    });

    const mobileRef = useRef();

    const loggedLinks = (
      <>
        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/")}
        >
          Home
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/freelancers")}
        >
          Freelancers
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => toogleSubMobileMenu(links.jobs)}
        >
          Jobs
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/inbox")}
        >
          <InboxNavItem />
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() =>
            toogleSubMobileMenu([
              {
                label:
                  loggedUser.valute &&
                  ((total + "").indexOf(".") != -1
                    ? (total + "").slice(0, (total + "").indexOf(".") + 3)
                    : total + " ") + loggedUser?.valute?.label,
              },
              ...links.account,
              {
                label: <AdminChargesNavItem />,
                url: "admin/charges",
              },
            ])
          }
        >
          Account
        </Typography>

        <Typography variant="h6" className={classes.mobileLink} onClick={clickLogout}>
          Logout
        </Typography>
      </>
    );

    const notLoggedLinks = (
      <>
        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/")}
        >
          Home
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/freelancers")}
        >
          Freelancers
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/register")}
        >
          Register
        </Typography>

        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => goToLink("/login")}
        >
          Login
        </Typography>
      </>
    );

    return (
      <div
        ref={mobileRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: mobileDrawMenu ? "-110%" : "0",
          transition: "all 1s ease-in",
          backgroundColor: "#adefd1",
          zIndex: 10,
        }}
      >
        <SubMobileMenu subMobileMenu={subMobileMenu} />

        <Typography
          variant="h6"
          style={{
            textAlign: "right",
          }}
        >
          <IconButton onClick={closeMobileDrawMenu}>
            <Clear style={{ color: "#00203f" }} />
          </IconButton>
        </Typography>

        {loggedUser.loggedIn ? loggedLinks : notLoggedLinks}
      </div>
    );
  };

  const [jobsMenu, setJobsMenu] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const loggedLinks = (
    <>
      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/")}
      >
        Home
      </Typography>

      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/freelancers")}
      >
        Freelancers
      </Typography>

      <div
        style={{
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => {
            setJobsMenu(!jobsMenu);
          }}
        >
          Jobs
        </Typography>

        <div
          style={{
            backgroundColor: "transparent",
            display: jobsMenu ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9,
            height: "100vh",
            width: "100vw",
          }}
          onClick={() => setJobsMenu(false)}
        ></div>
        <div
          style={{
            position: "absolute",
            transition: "all 1s ease-in",
            overflow: "hidden",
            maxHeight: jobsMenu ? "100vh" : "0",
            width: "300%",
            backgroundColor: "#00203f",

            borderWidth: jobsMenu ? "1px" : "0px",
            borderStyle: "solid",
            borderColor: "#adefd1",
            zIndex: 10,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          {links.jobs.map(
            (link, i) =>
              link.label && (
                <Typography
                  key={i}
                  variant="h6"
                  className={classes.subLink}
                  onClick={() => goToLink(link.url)}
                >
                  {link.label}
                </Typography>
              )
          )}
        </div>
      </div>

      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/inbox")}
      >
        <InboxNavItem />
      </Typography>

      <div
        style={{
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          className={classes.mobileLink}
          onClick={() => {
            setAccountMenu(!accountMenu);
          }}
        >
          <img
            src={
              "/media/freelancerAvatar/" +
              (loggedUser.avatar ? loggedUser.avatar : "unknown_user.jpg")
            }
            width="30"
            style={{
              borderRadius: "50%",
            }}
          />
        </Typography>
        <div
          style={{
            backgroundColor: "transparent",
            display: accountMenu ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9,
            height: "100vh",
            width: "100vw",
          }}
          onClick={() => setAccountMenu(false)}
        ></div>
        <div
          style={{
            position: "absolute",
            transition: "all 1s ease-in",
            overflow: "hidden",
            maxHeight: accountMenu ? "100vh" : "0",
            width: "400%",
            backgroundColor: "#00203f",

            borderWidth: accountMenu ? "1px" : "0px",
            borderStyle: "solid",
            borderColor: "#adefd1",
            zIndex: 10,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          {[
            {
              label:
                loggedUser.valute &&
                ((total + "").indexOf(".") != -1
                  ? (total + "").slice(0, (total + "").indexOf(".") + 3)
                  : total + " ") + loggedUser?.valute?.label,
            },
            ...links.account,
            { label: <AdminChargesNavItem />, url: "/admin/charges" },
          ].map(
            (link, i) =>
              link.label && (
                <Typography
                  key={i}
                  variant="h6"
                  className={classes.subLink}
                  onClick={() => goToLink(link.url)}
                >
                  {link.label}
                </Typography>
              )
          )}
        </div>
      </div>

      <Typography variant="h6" className={classes.mobileLink} onClick={clickLogout}>
        Logout
      </Typography>
    </>
  );

  const notLoggedLinks = (
    <>
      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/")}
      >
        Home
      </Typography>

      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/freelancers")}
      >
        Freelancers
      </Typography>

      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/register")}
      >
        Register
      </Typography>

      <Typography
        variant="h6"
        className={classes.mobileLink}
        onClick={() => goToLink("/login")}
      >
        Login
      </Typography>
    </>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar
          style={{
            backgroundColor: "#adefd1",
          }}
        >
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => goToLink("/")}
          >
            <Work
              style={{
                color: "#00203f",
                cursor: "pointer",
              }}
            />
          </Typography>
          {isMobile ? (
            <>
              <MobileDrawMenu
                mobileDrawMenu={mobileDrawMenu}
                closeMobileDrawMenu={closeMobileDrawMenu}
                loggedUser={loggedUser}
              />

              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={openMobileDrawMenu}
              >
                <MenuIcon
                  style={{
                    color: "#00203f",
                  }}
                />
              </IconButton>
            </>
          ) : (
            <div className={classes.headerOptions}>
              {loggedUser.loggedIn ? loggedLinks : notLoggedLinks}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
});

const mapDispatchToProps = {
  logoutUser: userActions.logout,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
