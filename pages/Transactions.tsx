import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Layout from '../components/layout.tsx'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Home.module.css'
import WalletTransactions from '../components/WalletTransactions';
import WalletGraph from '../components/WalletGraph';

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

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setSelectedCategory("All");
    setSelectedSubCategory("All");    
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const resetIndex_setCategory = (selectedCategory: string, selectedSubCategory: string) => {
    setValue(0);
    setSelectedCategory(selectedCategory);
    setSelectedSubCategory(selectedSubCategory);
  }

  return (     
    <Layout>      
      <Head>
        <title>
          Transactions Table & Bargraph
        </title>
      </Head>
      <div className={styles.backToHome}>
      <Link href="/WalletList">
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
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <WalletGraph 
            changeSelectedCategory={resetIndex_setCategory}
          />
        </TabPanel>        
      </SwipeableViews>
    </Layout>
  );
}