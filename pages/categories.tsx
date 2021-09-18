import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Box, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Card, CardActionArea, CardContent, CardMedia, CardActions, CircularProgress, Divider, InputBase, Paper, Typography, makeStyles} from "@material-ui/core";
import {PhotoCamera, Edit, Delete, AddAPhoto, Refresh, TableChart, ExpandLess, ExpandMore, Add, Check, Clear}  from '@material-ui/icons/';

import {API} from '../config';
import {getCategories, addSubCategory, editSubCategory, getTransactionCount, deleteSubCategory} from '../api/categoryApi'
import InitializeCategory from '../components/category-management/InitializeCategory';
import Category from '../components/category-management/Category';
import LoadingBackdrop, {LoadingDiv} from '../components/globals/LoadingBackdrop';

const useStyles = makeStyles((theme) => ({  
  addSubCategory:{
  	padding:"5px"
  }
}));

const Categories = () => {
	const classes = useStyles();	

	const [categories, setCategoryData] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [refreshMe, setRefresh] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
	useEffect(()=>{
		if(refreshMe){
			setIsLoading(true);
			getCategories()
				.then(data=>{
					if(typeof data==='undefined'){                   
            			return;          
          			}
          			if(data.error){                    
            			setError(data.error.toString())
          			} else {
            			setCategoryData(data);
            			console.log(data);
          			}
          			setIsLoading(false);
          			setRefresh(false);
				})
		}		
	}, [refreshMe]);

	return (
		<Layout>      
      		<Head>
        		<title>
          			Category Management
        		</title>
      		</Head>
      		{
        		isLoading &&
        		<LoadingBackdrop isLoading={isLoading} />
      		} 
      		<Container>
      			<Typography variant="h4">
      				{!isLoading && categories.length > 0?'Category Management':'To start, please enter initial sub category data.'}
      			</Typography>
      			{
      				!isLoading &&
      				categories.length === 0 &&
      				<InitializeCategory refresh={()=>setRefresh(true)} />
      			}
      			{
      				!isLoading &&
      				categories.length > 0 &&
      				categories.map((d,i)=><Category key={d._id} categoryData={d} refresh={()=>setRefresh(true)} />)
      			}
      		</Container>
      	</Layout>
	)
}



export default Categories;