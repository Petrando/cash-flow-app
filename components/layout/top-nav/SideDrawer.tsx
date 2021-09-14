import React, { useState } from "react";
import Link from "next/link";
import { Badge, Drawer, IconButton, List, ListItem, ListItemText } from "@material-ui/core";
import {Favorite}  from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `black`,
  },
})

const SideDrawer = ({navLinks}) => {
  const classes = useStyles();
  const [state, setState] = useState({ right: false }); // Add this

  const toggleDrawer = ( open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setState({ right: open })
  }

  const sideDrawerList = anchor => (     
    <List component="nav"
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
        {navLinks.map(({ title, path }) => (          
          <Link href={path} key={path}>
          <ListItem button className={classes.linkText}>
            <ListItemText primary={title} />
          </ListItem>          
          </Link>
        ))}
    </List>     
  );

  return (
    <>
      <IconButton edge="start" aria-label="menu"
      	onClick={toggleDrawer(true)}
      >
        <Menu fontSize="large" style={{ color: `white` }} />
      </IconButton>
      <Drawer
  		  anchor="right"
  		  open={state.right}  		  
  		  onClose={toggleDrawer(false)}
	   >
  		{sideDrawerList("right")}
	   </Drawer>
    </>
  );
}

//drawer property below..put it here because typescript complain..
//onOpen={toggleDrawer(true)}

export default SideDrawer;