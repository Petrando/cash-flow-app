import { makeStyles } from "@material-ui/core";
 
const useStyles = makeStyles((theme) => ({
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

export default useStyles;