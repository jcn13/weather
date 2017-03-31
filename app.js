const uri = 'https://locationiq.org/v1/search.php?key='
const apiKey = ''
const apiKey2 =''
const weather = document.getElementById('weather')
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec']
let unit = 'true'
let number = 1
let unitType = 'Farenheit'
let num = 5
let destination
let key1
let location1

weather.addEventListener('submit',(e)=>{
  e.preventDefault()
  fecthFunc(input(), unit, number)
})

function input(){
  let city = document.getElementById('city').value
  let country = document.getElementById('country').value
  destination = city+'&country='+country  
  return destination
}

function fecthFunc(destination, type, days){  
  fetch(`${uri}${apiKey}&format=json&city=${destination}`)
  .then((res) => res.json())
  .then((data) => { 
    location1 = data[0].lat+`,`+data[0].lon
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey2}%20&q=${location1}&toplevel=true`)
    .then((res) => res.json())
    .then((data) => {    
      key1 = data.Key
      fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/${days}day/${key1}?apikey=${apiKey2}&metric=${type}`)
      .then((res) => res.json())
      .then((data) => {
      console.log(data)     
        show(data)        
      })   
    })
  }).catch((e) => console.log(e, "location fail"))
}

function weekday(code){
  let date = new Date(code)
  let day = `${days[date.getDay()]}</th><th>${months[date.getMonth()]}, ${date.getDate()}`
  return day
}

function moods(data){
  let icon
  let n
  const weatherIcons = {
   a_0 : [1, 2, 3],
   a_1 : [4],
   a_2 : [5],
   a_3 : [7, 6, 8],
   a_4 : [11],
   a_5 : [12, 13, 14],
   a_6 : [15, 16, 17],
   a_7 : [18],
   a_8 : [19, 20, 21],
   a_9 : [22, 23],
   a_10 : [24, 25, 26, 29]
  } 
  for(i = 0; i<= 10; i++){
    n = 'weatherIcons.a_' + i
    for (let wthr in weatherIcons){
      let arr = weatherIcons[wthr]
      console.log(arr)            
      if(arr.includes(data)){
        console.log(n)
        icon = i
        return `<img src="images/${icon}.png" alt=" ">`
      }
      i++
    }      
  }   
}

function show (data) {    
  let html =`<button class="extra" id="f">Display in ${unitType}</button><button class="extra" id="d">${num} day Forecast</button>`
  for(let i=0; i<data.DailyForecasts.length; i++) {            
    html += '<table><tr><th>' + weekday(data.DailyForecasts[i].Date) + '</th></tr><tr><td>' + data.DailyForecasts[i].Day.IconPhrase + '</td><td>' + moods(data.DailyForecasts[i].Day.Icon) +'</td></tr><tr><td>Minimum</td><td>Maximum</td></tr><tr><td>' + data.DailyForecasts[i].Temperature.Minimum.Value + ' ' + data.DailyForecasts[i].Temperature.Minimum.Unit + '</td><td>' + data.DailyForecasts[i].Temperature.Maximum.Value + ' ' + data.DailyForecasts[i].Temperature.Minimum.Unit + '</td></tr></table>'
  }
  document.getElementById('display').innerHTML = html
  const f = document.getElementById('f')
  const d = document.getElementById('d')
  f.addEventListener('click',(e)=>{
  if(unit === 'true'){
    unit = 'false'    
    unitType = 'Celsius'
  } else {
    unit = 'true'    
    unitType = 'Farenheit'
  }
  e.preventDefault()
  fecthFunc(input(), unit, number)
  })
  d.addEventListener('click',(e)=>{
  if(number === 1){  
    number = 5 
    num = 1    
  } else {
    number = 1 
    num = 5    
  }
    e.preventDefault()
    fecthFunc(input(), unit, number)
  })
}
   