import * as React from "react";
import { green } from '@material-ui/core/colors';
import { Home,KeyboardArrowUp  } from "@material-ui/icons";
import { 
          AppBar, 
          Avatar, 
          Container, 
          Fab, 
          Hidden, 
          IconButton, 
          List, 
          ListItem, 
          ListItemText, 
          ListItemAvatar, 
          Toolbar  
        } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import {ListAlt, AccountBalanceWallet}  from '@material-ui/icons';

import SideDrawer from "./SideDrawer";
import HideOnScroll from "./HideOnScroll";
import BackToTop from "./BackToTop";

import Link from "next/link";

const navLinks = [
  { title: `home`, path: `/` },
  { title: `Wallets`, path: `/wallet-list`, icon:<AccountBalanceWallet />  },
  { title: `Income-Expenses`, path: `/category-management`, icon:<ListAlt />}, 
]

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  },
  navDisplayFlex: {
    display: `flex`,
    alignItems: `space-between`
  },  
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`
  },
  listItem: { 
    color: `white`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`
  },
  avatar: {
    color: '#fff',
    backgroundColor: green[500],
  }
});

const TopNavigation = () => {
  const classes = useStyles();

  return (
  	<>
  	<HideOnScroll>
    <AppBar position="fixed">
      <Toolbar>
      	<Container maxWidth="md" className={classes.navbarDisplayFlex}>
            <Link href={"/"}>
      		    <IconButton edge="start" color="inherit" aria-label="home" >
          		    <Home fontSize="large" />
        	    </IconButton>
            </Link>
        	<Hidden smDown>            
        		<List component="nav" aria-labelledby="main navigation"
        			className={classes.navDisplayFlex}
        		>
    				  {navLinks.map(({ title, path, icon }) => (      					
                        <span key={path} className={classes.linkText}>
                            <Link href={path}>
        					            <ListItem button className={classes.listItem}>
                                {
                                  icon &&
                                  <ListItemAvatar className={classes.linkText}>
                                    <Avatar className={classes.avatar}>
                                      {icon}
                                    </Avatar>
                                  </ListItemAvatar>
                                }
                                <ListItemText primary={title} />          						
        					            </ListItem>   
                            </Link>   					
                        </span>
    				  ))}            
  				</List>          
  			</Hidden>
  			<Hidden mdUp>
  				<SideDrawer navLinks={navLinks} />
  			</Hidden>
  		</Container>
      </Toolbar>
    </AppBar>
    </HideOnScroll>
    <Toolbar id="back-to-top-anchor" />
    <BackToTop>
  		<Fab color="secondary" size="large" aria-label="scroll back to top">
    		<KeyboardArrowUp />
  		</Fab>
	</BackToTop>
    </>
  )
}

export default TopNavigation;