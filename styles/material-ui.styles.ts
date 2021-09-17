import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { green } from '@material-ui/core/colors';

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

export const useCategoryStyles = makeStyles((theme) => ({
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

export const useWalletStyles=makeStyles({  
    walletButton: {
      fontSize:'10px'
    }
})

export const useTransactionStyles = makeStyles((theme) => ({
  rowDiv: {
      display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center',
      flexWrap:'wrap'
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