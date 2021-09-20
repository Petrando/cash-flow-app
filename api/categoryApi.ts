import {API} from '../config';

export function getCategories() {    
  return fetch(`${API}category`)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
}

export function initCategories(data){
  
  return fetch(`${API}category/intitialize/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  })
}

export function addSubCategory(categoryId, data){
   return fetch(`${API}category/addSubCategory/${categoryId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',     
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
}

export function editSubCategory(categoryId, subCategoryId, data){
   return fetch(`${API}category/editSubCategory/${categoryId}/${subCategoryId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',     
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
}

export function deleteSubCategory(categoryId, subCategoryId){
   return fetch(`${API}category/removeSubCategory/${categoryId}/${subCategoryId}`, {
      method: 'DELETE'
    })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
}

export function getTransactionCount(categoryId, subCategoryId){
  return fetch(`${API}category/getTransactionsOfSubCategory/${categoryId}/${subCategoryId}`)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
}
