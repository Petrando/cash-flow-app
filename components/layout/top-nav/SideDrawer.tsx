import React, { useState, MouseEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { Avatar, Drawer, IconButton, List, ListItem, ListItemText, ListItemAvatar, MenuItem } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Menu } from "@material-ui/icons";
import { navLinkI } from "../../../types";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `black`,
  },
  avatar: {
    color: '#fff',
    backgroundColor: green[500],
  }
})

const SideDrawer = ({navLinks}:{navLinks:navLinkI[]}):JSX.Element => {
  const classes = useStyles();
  const [state, setState] = useState<boolean>(false); 

  const toggleDrawer = ( open:boolean) => (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {    
    /*
    if (       
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }*/
    setState(open)
  }

  const menuItem = (item:navLinkI) => (                       
    <Link href={item.path} key={item.path}>
      <ListItem button className={classes.linkText}>
        {
          item.icon &&
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {item.icon}
            </Avatar>
          </ListItemAvatar>
        }
        <ListItemText primary={item.title} />
      </ListItem>          
    </Link>               
  );

  return (
    <>
      <IconButton 
        edge="start" 
        aria-label="menu"
      	onClick={toggleDrawer(true)}
      >
        <Menu fontSize="large" style={{ color: `white` }} />
      </IconButton>
      <Drawer
  		  anchor="right"
  		  open={state}  		  
  		  onClose={toggleDrawer(false)}
	   >
  		<List 
        component="nav"
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {
          navLinks.map((linkItem) => menuItem(linkItem))
        }
      </List>
	   </Drawer>
    </>
  );
}

export default SideDrawer;