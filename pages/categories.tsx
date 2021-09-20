import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import { Container } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import {getCategories} from '../api/categoryApi'
import InitializeCategory from '../components/category-management/InitializeCategory';
import LoadingBackdrop from '../components/globals/LoadingBackdrop';
import Category from '../components/category-management/Category';
import { categoryI } from '../types';
import { useCategoryStyles } from '../styles/material-ui.styles';

const Categories = () => {	
	const classes = useCategoryStyles();

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
					<Typography variant="h5" className={classes.pageTitle} >
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

export default Categories;