//import request from 'request';
//import request from '../node_modules/@types/request/index';
import request from '../node_modules/@playwright/test';
 //node_modules\@types\request\index.d.ts
//import {request} from '@playwright/test';
// const { request } = require('@playwright/test');
//import { Page } from '@playwright/test';
let statusCode: number;

//<summary>
// Get File Share Service Api Response
//</summary>
//<param> apiUrl </param>
//<param> queryString </param>
//<param> accessToken </param>

export async function GetApiDetails(apiUrl: string, queryString: string, accessToken: string) {
  const options = {
    method: 'GET',
    url: `${apiUrl}/batch?$filter=${queryString}`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`
    }
  }

  request(options, (error: string | undefined, response: any) => {
    if (error) throw new Error(error)    
    statusCode =response['statusCode'];
    

  });
 // await page.waitForTimeout(2000);
  return statusCode;
 
}

export async function GetApiDetailsNew(apiUrl: string, queryString: string, accessToken: string) {
  const options = {
    method: 'GET',
    url: `${apiUrl}/batch?$filter=${queryString}`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`
    }
  }

  request(options, (error: string | undefined, response: any) => {
    if (error) throw new Error(error)    
    statusCode =response['statusCode'];
    

  });
 // await page.waitForTimeout(2000);
  return statusCode;
 
}