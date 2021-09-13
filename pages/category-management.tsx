import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Box, Button, CssBaseline, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, TextField } from "@material-ui/core";
import {Divider, Paper, Typography, makeStyles} from "@material-ui/core";

import {API} from '../config';
import {getCategories} from '../api/categoryApi'
import InitializeCategory from '../components/category-management/InitializeCategory';
import LoadingBackdrop from '../components/globals/LoadingBackdrop';
import { categoryI } from '../types';
import Category from '../components/category-management';



const CategoryManagement = () => {	

	const [categories, setCategoryData] = useState<categoryI[]>([]);
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
      		<Container>
			  	{
        			isLoading &&
        			<LoadingBackdrop isLoading={isLoading} />
      			} 
				{
					!isLoading &&
					<Typography variant="h4">
						{
							categories.length > 0?
							'Category Management':
							'To start, please enter initial sub category data.'
						}
					</Typography>
				}				      			      				     							      			
      			{
      				!isLoading &&
					<>
					{
						categories.length > 0?
						categories.map((d,i)=><Category key={d._id} 
														categoryData={d} 
														refresh={()=>{setRefresh(true)}} />)
						:
						<InitializeCategory refresh={()=>{setRefresh(true)}} />
					}
					</>      				
      			}
      		</Container>
      	</Layout>
	)
}



export default CategoryManagement;