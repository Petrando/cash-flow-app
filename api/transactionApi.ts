import {API} from '../config';

export function getAllTransactions() {    
  return fetch(`${API}transaction`)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })  
}

export function getFirstPageTransaction_and_category(walletId, sortData, filterData) {     
  return fetch(`${API}transaction/firstBatchByWallet/${walletId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify({sortData, filterData})
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })  
}

export function getTransactionsByWallet(walletId, currentPage, sortData, filterData) {     
  return fetch(`${API}transaction/byWallet/${walletId}/${currentPage}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify({sortData, filterData})
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })  
}

export function addNewTransaction(walletId, data){
  //console.log(data);
  return fetch(`${API}transaction/create/${walletId}`, {
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

export function updateTransaction(walletId, transactionId, updatedWalletBalance, updatedTransaction){
  return fetch(`${API}transaction/update/${walletId}/${transactionId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify({updatedWalletBalance:updatedWalletBalance, updatedTransaction})
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  }) 
}

//router.delete('/transaction/removeTransaction/:walletToUpdateId/:transactionId', removeTransaction)
export function deleteTransaction(walletId, transactionId, updatedWalletBalance){
  return fetch(`${API}transaction/removeTransaction/${walletId}/${transactionId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify({updatedWalletBalance})
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  }) 
}

export function getWalletGraphData(walletId, filterData){
   return fetch(`${API}transaction/graphData/${walletId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',     
    },
    body: JSON.stringify({filterData})
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    }) 
}