import request from 'request';
let statusCode: number;

//<summary>
// Get File Share Service Api Response
//</summary>
//<param> apiUrl </param>
//<param> queryString </param>
//<param> accessToken </param>
//<param>Expected responseStausCode </param>

export async function GetApiDetails(apiUrl:string, queryString:string, accessToken:string, responseStausCode:number)
{
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
        statusCode=response['statusCode'];        
        expect(statusCode).toEqual(responseStausCode);        
        
      });   
}