import getCurrentMonthName from "../../api/currentMonthName";

export const initialFilter = {category:'0', subCategory:'0', dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}}

export const filterReducer = (state, action) => {  
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