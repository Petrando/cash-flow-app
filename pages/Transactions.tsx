import React, {useReducer, useState} from 'react';
import Head from 'next/head';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Layout from '../components/layout'
import WalletTransactions from '../components/transaction-management/WalletTransactions';
import WalletGraph from '../components/transaction-management/WalletGraph';
import getCurrentMonthName from '../api/currentMonthName';
import TabPanel, {a11yProps} from "../components/transaction-management/TransactionTab"
import { transactionFilter, transactionFilterReducer } from '../components/transaction-management/StoreNReducer';

export default function Transactions():JSX.Element {
  const theme = useTheme();
  const [tabIdx, setTabIndex] = useState(0);

  const [filter, dispatchFilter] = useReducer(transactionFilterReducer, transactionFilter);

  const handleChange = (event: React.ChangeEvent<{}>, newIdx: number) => {    
    dispatchFilter({type:'RESET_CATEGORY_SUBCATEGORY'});    
    if(newIdx===1){
      dispatchFilter({type:'SET_MONTH', month:getCurrentMonthName()});
    }
    setTabIndex(newIdx);
  };

  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const setCategoryNResetTab = (selectedCategory: string, selectedSubCategory: string) => {        
    dispatchFilter({type:'SET_CATEGORY_SUBCATEGORY', category:selectedCategory, subCategory:selectedSubCategory});
    setTabIndex(0);    
  }

  return (     
    <Layout>      
      <Head>
        <title>
          Transactions Table Details & Charts
        </title>
      </Head>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIdx}
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
        index={tabIdx}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={tabIdx} index={0} dir={theme.direction}>         
          <WalletTransactions 
            filter={filter}
            dispatchFilter={dispatchFilter}
          />
        </TabPanel>
        <TabPanel value={tabIdx} index={1} dir={theme.direction}>
          <WalletGraph 
            changeSelectedCategory={setCategoryNResetTab}
            filter={filter}
            dispatchFilter={dispatchFilter}
          />
        </TabPanel>        
      </SwipeableViews>
    </Layout>
  );
}