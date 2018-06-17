export const crudAPI = async (method, endPoint, data) => {
  const response = await fetch(endPoint, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'user-agent': 'NachoMerino',
      'content-type': 'application/json'
    },
    method: method,
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;      
}

export const getMonthYear = date => {
  const splitDate = date.split('/')
  const year = splitDate[2]
  const month = splitDate[1]
  return {year, month} 
}