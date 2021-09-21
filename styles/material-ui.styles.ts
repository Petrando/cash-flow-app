import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors';

export const useCommonStyles = makeStyles((theme: Theme) => ({
  errorText: {
    color: red[500],
    textAlign: 'center'
  }
}));

export const useTopNavStyles = makeStyles({
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
  activeLink: {
    borderBottom:`4px solid #DC2626`
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

export const useSideDrawerNavStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `black`
  },
  activeLink: {
    textDecoration:'underline',
    fontWeight:'bolder'
  },
  avatar: {
    color: '#fff',
    backgroundColor: green[500],
  }
})

export const useHomeCardStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 345,
      height:220,
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between'
    },
    avatar: {
      color: '#fff',
      backgroundColor: green[500],
    },
    cardActions: {
      display:'flex',
      justifyContent:'flex-end',
      alignItems:'center'
    },
    [theme.breakpoints.down('xs')]: {
      root: {
        width:'90%'
      },
    },
  }),
);

export const useCategoryStyles = makeStyles((theme: Theme) => ({
  root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
  },
  pageTitle:{
    textAlign:'center',
    margin:'10px auto 10px'
  },
  fullwidthText : {
      textAlign:'left', 
      width: '100%',
      marginLeft:'5px'
  },
  iconButton: {
      padding: 10,
  },
  divider: {
      height: 28,
      margin: 4,
  },
  addSubCategory:{
    padding:"5px"
  }
}));

export const useWalletStyles = makeStyles({  
    newWalletContainer: {
      display:'flex', justifyContent:'flex-end', alignItems:'center',
      marginTop:'10px'
    },
    newWalletButton: {
      marginRight:'5px'
    },
    walletListHeader: {
      textAlign:'center'
    },
    walletButton: {
      fontSize:'10px'
    },
    walletImageContainer: {
      height:'194px',
      display:'flex', justifyContent:'center', alignItems:'center',
      position:'relative',
      overflow:'hidden'
    },
    walletImage: {
      position:'absolute',
      left:'0px',
      top:'0px',
      width:'100%',
      height:'194px'      
    }
})

export const useTransactionStyles = makeStyles((theme: Theme) => ({
  topPageTitle:{
    margin:"15px auto",
    textAlign:"center"
  },
  topButtonContainer: {
      display:'flex', flexDirection:'row', justifyContent:'flex-end', alignItems:'center',
      flexWrap:'wrap',
      margin:"10px auto"
  },
  pageTitle: {
      textAlign:'center'
  },  
  selectContainer: {
      display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'
  },
  drawerControl: {  
      marginTop:'15px',
      padding:'5px 5px 5px 15px',
  },
}));

export const useTransactionTableStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});