import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css';
//設定常用參數
let baseURL = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot';
let baseReqDemand = '?$top=30&$format=JSON'
let citys ={
  '臺北市':'Taipei','新北市':'NewTaipei','桃園市':'Taoyuan','臺中市':'Taichung','臺南市':'Tainan',
  '高雄市':'Kaohsiung','基隆市':'Keelung','新竹市':'Hsinchu','新竹縣':'HsinchuCounty','苗栗縣':'MiaoliCounty',
  '彰化縣':'ChanghuaCounty','南投縣':'NantouCounty','雲林縣':'YunlinCounty','嘉義縣':'ChiayiCounty',
  '嘉義市':'Chiayi','屏東縣':'PingtungCounty','宜蘭縣':'YilanCounty','花蓮縣':'HualienCounty',
  '臺東縣':'TaitungCounty','金門縣':'KinmenCounty','澎湖縣':'PenghuCounty','連江縣':'LienchiangCounty'
  };

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {city_value: []};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({city_value: event.target.value});
  }
  render(){
    return(
      <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scenicSpot">Scenic spot</Link></li>
            <li><Link to={`/scenicSpot/${this.state.city_value}`}>City spot</Link></li>
            <select onChange={this.handleChange}>
              <option>選擇縣市</option>
              {Object.keys(citys).map(key=>(<option value = {citys[key]}>{key}</option>))}
            </select>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/scenicSpot" component={Scenicspot} />
          <Route exact path={`/scenicSpot/${this.state.city_value}`}>
            <Cityspot cityname={this.state.city_value} />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}

//偵測是否抵達網頁底部
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
    if (props.cityname === undefined){
      this.url = baseURL+ baseReqDemand;
    }
    else{
      this.url = baseURL+'/' +props.cityname +baseReqDemand;}
    console.log("URL:",this.url);
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
    fetch(this.url)
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
    this.setState({
      isLoading:false
    });
    }
  
  render() {
    const { data , isLoading, } = this.state;
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
class Cityspot extends Scenicspot {
  constructor(props){
    super(props);
    console.log("URL:",this.url);
  }
}

class Home extends React.Component {
  render(){
    return(
      <h2>HOME</h2>
      )
  };
}

export {App};
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);