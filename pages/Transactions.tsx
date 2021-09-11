import React, {useReducer, useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Home.module.css'
import WalletTransactions from '../components/WalletTransactions';
import WalletGraph from '../components/WalletGraph';
import getCurrentMonthName from '../api/currentMonthName';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

const initialFilter = {category:'0', subCategory:'0', dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}}

const filterReducer = (state, action) => {  
  switch (action.type){
    case 'INITIALIZE':
      const {category, subCategory} = action;    
      return {...state, category, subCategory}  
    case 'RESET_FILTER':            
      return {...initialFilter, dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}};
    case 'SET_CATEGORY':      
      return {...state, category:action.category, subCategory:'0'}
    case 'SET_SUBCATEGORY':      
      return {...state, subCategory:action.subCategory}
    case 'SET_CATEGORY_SUBCATEGORY':      
      return {...state, category:action.category, subCategory:action.subCategory}
    case 'RESET_CATEGORY_SUBCATEGORY':     
      return {...state, category:'0', subCategory:'0'}
    case 'SET_MONTH':
      const {month} = action;      
      return {...state, dateFilter:{month, startDate:'', endDate:''}};
    case 'SET_DATE_RANGE':
      const {startDate, endDate} = action;
      return {...state, dateFilter:{month:'Date range', startDate, endDate}}
    default:
      return state;
  }
}

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {    
    dispatchFilter({type:'RESET_CATEGORY_SUBCATEGORY'});    
    if(newValue===1){
      dispatchFilter({type:'SET_MONTH', month:getCurrentMonthName()});
    }
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const resetIndex_setCategory = (selectedCategory: string, selectedSubCategory: string) => {        
    dispatchFilter({type:'SET_CATEGORY_SUBCATEGORY', category:selectedCategory, subCategory:selectedSubCategory});
    setValue(0);    
  }

  return (     
    <Layout>      
      <Head>
        <title>
          Transactions Table Details & Charts
        </title>
      </Head>
      <div className={styles.backToHome}>
      <Link href="/wallet-list">
          <a>← Back to Wallets</a>
      </Link>            
    </div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
        >
          <Tab label="Transactions Table" {...a11yProps(0)} />
          <Tab label="Transactions Graph" {...a11yProps(1)} />          
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>         
          <WalletTransactions 
            filter={filter}
            dispatchFilter={dispatchFilter}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <WalletGraph 
            changeSelectedCategory={resetIndex_setCategory}
            filter={filter}
            dispatchFilter={dispatchFilter}
          />
        </TabPanel>        
      </SwipeableViews>
    </Layout>
  );
}