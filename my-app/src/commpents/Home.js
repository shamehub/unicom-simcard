import React from 'react';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ChannelTable from './Channel-Table';
import ProductTable from './Product-Table';
import RecordsTable from './Records-Table'
import RecordsDetails from './Details-Table';
// import FormSearch from './Form-Search';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

export default class SimpleTabs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value:0,
      channelData:[],
      productData:[],
      recordsDetails:{},
      detailsTitle:"",
    }
  }

  componentDidMount(){
    let cUrl = 'http://api-test.xinwentuan.com/getdata.php';
    let pUrl = 'http://api-test.xinwentuan.com/product/getdata.php';
    axios.post(cUrl)
      .then(response =>{
        this.setState({
          channelData:response.data
        })
      })
    axios.post(pUrl)
      .then(response =>{
        this.setState({
          productData:response.data
        })
      })
  }

  handleChange(event, newValue){
    this.setState({value:newValue});
  }

  // description--->name
  transformName(abc,a){
    let c = "";
    abc.map((v)=>{
      if (v.description === a) {c = v.name; return c; } return c;
    })
    return c;
  }

  setRecordsDetails(data){
    let postData = {};
    let title = "渠道："+data.channel+" ，产品："+data.product;
    postData.channel = this.transformName(this.state.channelData,data.channel);
    postData.product = this.transformName(this.state.productData,data.product);
    if (data.date) {
      postData.startDate = data.date+" 0:00:00";
      postData.endDate = data.date+" 23:59:59";
    }
    console.log('postData',postData);

    axios({
      method: 'post',
      url: 'http://api-test.xinwentuan.com/records/getdata_details.php',
      data: postData,
      transformRequest: [
         function (data) {
            let ret = ''
            for (let it in data) {
               ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
         }
       ],
       headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
       }
    })
    .then(response => {
      if (response.data === 'err') {
        alert("未获取到数据");     
      } else {
        this.setState({
          recordsDetails:response.data,
          detailsTitle:title
        })
      }
    })
  }

  render(){
    const value = this.state.value;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
            <Tab label="统计" {...a11yProps(0)} />
            <Tab label="渠道表" {...a11yProps(1)} />
            <Tab label="产品表" {...a11yProps(2)} />
            <Tab label="" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} >
          <RecordsTable 
            handleChange={this.handleChange.bind(this)} 
            setRecordsDetails={this.setRecordsDetails.bind(this)}
            channelData={this.state.channelData}
            productData={this.state.productData}
            />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ChannelTable 
          channelData={this.state.channelData} 
          productData={this.state.productData}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProductTable 
          productData={this.state.productData}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <RecordsDetails 
          data={this.state.recordsDetails} 
          title={this.state.detailsTitle}
          />
        </TabPanel>
      </div>
    );
  }

}