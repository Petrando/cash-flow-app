import React, {useReducer, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import WalletTransactions from '../components/transaction-management/WalletTransactions';
import WalletGraph from '../components/transaction-management/WalletGraph';
import getCurrentMonthName from '../api/currentMonthName';
import TabPanel, {a11yProps} from "../components/transaction-management/TransactionTab"
import { initialFilter, filterReducer } from '../components/transaction-management/StoreNReducer';

export default function Transactions() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

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