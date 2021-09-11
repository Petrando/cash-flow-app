import {API} from '../config';

export async function getWallets(args) {    
  return fetch(`${API}wallet`)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    })
  /*let wallets = [];
  
  try{
    const fetchResult = await(fetch(`${API}wallet`));
    const data = await(fetchResult.json());    
    args[0](data)
  }
  catch(err){
    console.log(err);
  }
  if(args.length > 1){
    for(let i=1; i < args.length; i++){
      args[i]();
    }
  }*/
}

//wallet/create/
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

///wallet/update/:walletId
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

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string })
  }
}