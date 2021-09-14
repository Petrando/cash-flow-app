import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { ButtonGroup, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio} from '@material-ui/core/';

import DatePickers from '../globals/DatePickers';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  drawerControl: {  
    marginTop:'15px',
    padding:'5px 5px 5px 15px',
  }, 
  selectMonthControl: {
    padding:'5px 5px 5px 15px'
  },
  buttonContainer: {
    marginTop:'20px',
    marginRight:'15px',
    display:'flex', flexDirection:'row', justifyContent:'flex-end', alignItems:'center'
  }
});

export default function FilterDateRange({transactionFilter, dispatchDateRange}) {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [dateFrom, setFrom] = useState<string>('');
  const [dateTo, setTo] = useState<string>('');

  const [editDirty, setEditDirty] = useState<boolean>(false);

  useEffect(()=>{
    if(state.right){
      initializeDateRange();
    }    
  }, [state.right]);

  const initializeDateRange = () => {
    const {dateFilter:{startDate, endDate}} = transactionFilter;
    setFrom(startDate);
    setTo(endDate);
    setEditDirty(false);
  }

  const changeDate = (dateState, newDate) => {
    //dateState==='from'?setFrom(newDate):setTo(newDate);
    if(dateState==='from' && dateFrom!==newDate){
      if(dateTo!==''){
        const dateObjFrom = new Date(newDate);
        const dateObjTo = new Date(dateTo);

        if(dateObjFrom > dateObjTo){
          setFrom(dateTo)
        }else{
          setFrom(newDate);
        }
      }else{
        setFrom(newDate);
      }
      if(!editDirty){setEditDirty(true)}
    }

    if(dateState==='to' && dateTo!==newDate){
      if(dateFrom!==''){        
        const dateObjFrom = new Date(dateFrom);
        const dateObjTo = new Date(newDate);

        if( dateObjTo < dateObjFrom){          
          setTo(dateFrom)
        }else{
          setTo(newDate);
        }
      }else{
        setTo(newDate);
      }
      if(!editDirty){setEditDirty(true)}
    }
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    
    setState({ ...state, [anchor]: open });
  };  

  const list = () => (
    <div
      className={clsx(classes.list, {[classes.fullList]: false})}
      role="presentation"      
    >              
      <TimeSelection dateFrom={dateFrom} dateTo={dateTo} changeDate={changeDate} />
      <Divider />
      <div className={classes.buttonContainer} >
        <Button variant="contained" color="primary" size="small"
          onClick={(e)=>{
            toggleDrawer('right', false)(e);
            dispatchDateRange(dateFrom, dateTo);
            setEditDirty(false);            
          }}          
          onKeyDown={toggleDrawer('right', false)}
          disabled={!editDirty || dateTo==='' || dateFrom===''}
        >
          Apply
        </Button>        
        <Button variant="contained" color="primary" size="small"
          onClick={initializeDateRange}          
          disabled={!editDirty}          
        >
          Reset
        </Button>
        <Button variant="contained" color="secondary" size="small"
          onClick={toggleDrawer('right', false)}
          onKeyDown={toggleDrawer('right', false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div>     
      <>
        <Button onClick={toggleDrawer('right', true)}>Date Range</Button>
        <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
          {state.right && list('right')}
        </Drawer>
      </>      
    </div>
  );
}

const TimeSelection = ({dateFrom, dateTo, changeDate}) => {
  const classes = useStyles();
  
  return (
    <>    
    <FormControl className={classes.drawerControl} component="fieldset">
      <FormLabel component="legend">Filter Date Range</FormLabel>
      <DatePickers id={"start-date"} label={"From"} myDate={dateFrom} changeDate={changeDate} />
      <DatePickers id={"end-date"} label={"To"} myDate={dateTo} changeDate={changeDate}  />
    </FormControl> 
    </>
  )
}
