import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import {Container, Typography, TextField, IconButton, Paper} from '@material-ui/core';

import {initCategories} from '../api/categoryApi';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Let's get started!", 'Create starter sub category for Income', 'Create starter sub category for Expenses'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Begin intitializing.';
    case 1:
      return 'For income, enter a starter sub category';
    case 2:
      return 'For expense, enter a starter sub category';
    default:
      return 'Unknown stepIndex';
  }
}

export default function InitializeCategory({refresh}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [incomeSub, setIncomeSub] = useState<string>('');
  const [expenseSub, setExpenseSub] = useState<string>('');
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setExpenseSub('');
    setIncomeSub('');
    setActiveStep(0);
  };

  const submitInitialize = (e) => {
    e.preventDefault()    
    initCategories({incomeSub, expenseSub})
      .then(data=>{
        if(typeof data === 'undefined'){
          return;
        }
        if(data.error){

        }
        else{
          refresh();
        }        
      })
  }

  return (
    <div className={classes.root}>      
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Finalize incomeSub={incomeSub} expenseSub={expenseSub} />
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button variant="contained" color="primary" onClick={submitInitialize}>Submit</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            {
              activeStep===0 &&
              <Typography className={classes.instructions}>Begin intitializing transaction categories.</Typography>
            }
            {
              activeStep===1 &&
              <SubCategoryInput 
                value={incomeSub}
                changeHandler={(e)=>setIncomeSub(e.target.value)}
                label={'Income sub category'}
              />
            }
            {
              activeStep===2 &&
              <SubCategoryInput 
                value={expenseSub}
                changeHandler={(e)=>setExpenseSub(e.target.value)}
                label={'Expense sub category'}
              />
            }
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}
                disabled={
                  activeStep===1 && incomeSub===""?
                  true:
                  activeStep===2 && expenseSub===""?
                  true:
                  false
                }
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SubCategoryInput = ({value, changeHandler, label}) => {
  return (
    <TextField
      autoFocus       
      margin="dense"          
      label={label}
      type="text" 
      value={value}     
      onChange={changeHandler}
      fullWidth          
    />
  )
}

const Finalize = ({incomeSub, expenseSub}) => {
  return (  
    <Container>  
      <Button variant="contained" color="primary" fullWidth>
        Income
      </Button>    
      <Paper xs={12}>
        {incomeSub} 
      </Paper>
      <Button variant="contained" color="primary" fullWidth>
        Expense
      </Button>
      <Paper xs={12}>
        {expenseSub}
      </Paper>
    </Container>
  )
}
//<Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>