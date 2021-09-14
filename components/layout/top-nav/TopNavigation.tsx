import * as React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Home,KeyboardArrowUp  } from "@material-ui/icons";
import { Badge, Container, Fab, List, ListItem, ListItemText, Hidden  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import {Favorite}  from '@material-ui/icons';

import SideDrawer from "./SideDrawer";
import HideOnScroll from "./HideOnScroll";
import BackToTop from "./BackToTop";

import Link from "next/link";

const navLinks = [
  { title: `home`, path: `/` },
  { title: `Income-Expenses`, path: `/category-management` },
  { title: `Wallets`, path: `/wallet-list` } 
]

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`
  },
  listItem: { 
    color: `white`
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
    				{navLinks.map(({ title, path }) => (      					
                        <span key={path} className={classes.linkText}>
                            <Link href={path}>
        					            <ListItem button>
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

export default TopNavigation
