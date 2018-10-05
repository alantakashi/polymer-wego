import axios from 'axios'
import CircularJSON from 'circular-json'

const getHotels = (req, res, next) => {
  axios({
    method: 'GET',
    url: 'http://137.116.129.201/api/hotels'
  }).then(response => {
    let json = CircularJSON.stringify(response.data)
    res.send(json)
  }).catch(err => {
    console.log('Error', err)
  })
}

export { getHotels }
