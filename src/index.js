import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css';

const rootElement = document.getElementById("root");
let baseURL = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot';
let baseReqDemand = '?$top=30&$format=JSON'
let spoturl = baseURL+ baseReqDemand;
let citys ={
  '臺北市':'Taipei','新北市':'NewTaipei','桃園市':'Taoyuan','臺中市':'Taichung','臺南市':'Tainan',
  '高雄市':'Kaohsiung','基隆市':'Keelung','新竹市':'Hsinchu','新竹縣':'HsinchuCounty','苗栗縣':'MiaoliCounty',
  '彰化縣':'ChanghuaCounty','南投縣':'NantouCounty','雲林縣':'YunlinCounty','嘉義縣':'ChiayiCounty',
  '嘉義市':'Chiayi','屏東縣':'PingtungCounty','宜蘭縣':'YilanCounty','花蓮縣':'HualienCounty',
  '臺東縣':'TaitungCounty','金門縣':'KinmenCounty','澎湖縣':'PenghuCounty','連江縣':'LienchiangCounty'
  };
let city;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {city_value: []};
    this.city_value=[];
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    city = event.target.value;
    this.setState({city_value: event.target.value});
  }
  getCityName(){
    return this.state.city_value;
  }
  render(){
    return(
      <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scenicSpot">Scenic Spot</Link></li>
            <li><Link to={`/scenicSpot/${this.state.city_value}`}>Users</Link></li>
            <select onChange={this.handleChange}>
              <option>選擇縣市</option>
              {Object.keys(citys).map(key=>(<option value = {citys[key]}>{key}</option>))}
            </select>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/scenicSpot" component={Scenicspot} />
          <Route path={`/scenicSpot/${this.state.city_value}`} component={Cityspot} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}
function detectBottom(){
  const body = document.body;
  const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
  const html = document.documentElement;
  const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  const windowBottom = windowHeight + window.pageYOffset;
  return windowBottom >= docHeight-5;
}

class Scenicspot extends App {
  constructor(props){
    super(props);
    this.url = spoturl;
    this.state = {data:[],isLoading:false, count:0};
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll(event){
    if (detectBottom()) {
      let request = new XMLHttpRequest();
      this.state.count++;
      request.open('GET', this.url+'&$skip=' + String(30*(this.state.count)));
      let olddata= this.state.data;
      const scenic = this;
      request.onload = function () {
        let newdata = olddata.concat(JSON.parse(this.response));
        scenic.setState({data : newdata});
      }
      request.send();
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    const cityspot = this;
    cityspot.url = spoturl;
    fetch(cityspot.url)
    .then(res=> res.json())
    .then((result)=>{
      this.setState({
        data : result,
        isLoading:true
        })
      })
    }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    }
  
  render() {
    const { data , isLoading, count } = this.state;
    if (!isLoading){
      return <div>Loading...</div>;
    } else{
      return(
      <div onScroll={this.handleScroll}>
        {data.map(dat=><div><h2>{dat.Name}</h2><p>{dat.Description}</p></div>)}
      </div>);
    }
    }
}
function Home() {
  return <h2>Home</h2>;
}
class Cityspot extends App {
  constructor(props){
    super(props);
    this.url = baseURL+'/' +city +baseReqDemand;
    this.state = {data:[],isLoading:false, count:0};
  }
  componentDidMount(){
    const cityspot = this;
    cityspot.url = baseURL+'/' +city +baseReqDemand;
    fetch(cityspot.url)
    .then(res=> res.json())
    .then((result)=>{
      this.setState({
        data : result,
        isLoading:true
      })
    })
  }
  render(){
    const { data , isLoading, count } = this.state;
    if (!isLoading){
      return <div>Loading...</div>;
    } else{
      return(
      <div onScroll={this.handleScroll}>
        {data.map(dat=><div><h2>{dat.Name}</h2><p>{dat.Description}</p></div>)}
      </div>);
    }
  }
}

export {App};
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);