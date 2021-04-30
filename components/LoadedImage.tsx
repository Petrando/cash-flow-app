import React, {useEffect, useState} from 'react';
import {CircularProgress, Paper} from "@material-ui/core/";

interface ItemImageProps {
	source:string,
	imgStyle:object
}

let _isLoaded:boolean = false;

const LoadedImage = ({source, imgStyle}:ItemImageProps):JSX.Element => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');

  useEffect(() => {		
		_isLoaded = true;
		//getImageData();	
		if(_isLoaded){
			setImgUrl(source);
		}
		return () => {
			_isLoaded = false;
		}	
	}, [source, imgUrl]);

  return (
    <Paper style={{width:'100%', height:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'5px 5px'}}>
      {
        !imageLoaded &&        
        <CircularProgress />          
      } 
      {
      	imgUrl!=="" &&
      	<img      		
        	style={{...imgStyle, display:imageLoaded?"inline-block":"none"}}
        	src={imgUrl}
        	onLoad={()=>setImageLoaded(true)}
      	/>
      }              
    </Paper> 
  )
}

export default LoadedImage;