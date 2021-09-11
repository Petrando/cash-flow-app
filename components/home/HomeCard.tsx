import React from 'react';
import Link from 'next/link';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import ForwardIcon from '@material-ui/icons/Forward';
import { walletMenuI } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      height:220,
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between',
    },
    avatar: {
      color: '#fff',
      backgroundColor: green[500],
    },
    cardActions: {
      display:'flex',
      justifyContent:'flex-end',
      alignItems:'center'
    }
  }),
);

export default function HomeCard({title, about, avatar, linkTo}:walletMenuI):JSX.Element {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {avatar}
          </Avatar>
        }        
        title={title}        
      />      
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {about}
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Link href={linkTo}>
          <Button color="primary" endIcon={<ForwardIcon />} aria-label="go">
            Go
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
