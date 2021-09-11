import {API} from '../config';

export async function getWallets(args) {    
  return fetch(`${API}wallet`)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
}

export const createWallet =  (walletData) => {    
  return fetch(`${API}wallet/create/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json'      
    },
    body: walletData
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  })
}

export const updateWallet = (updatedWallet, walletId) => {
  return fetch(`${API}wallet/update/${walletId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json'      
    },
    body: updatedWallet
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  })
}

export const deleteWallet = (walletId) => {
  return fetch(`${API}wallet/delete/${walletId}`, {method: 'DELETE'})
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  })
}