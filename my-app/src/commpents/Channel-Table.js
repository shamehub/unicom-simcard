import React from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ChannelTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { 
          title: 'Status', 
          field: 'status',
          lookup: { 1 :"有效", 0:"无效"},
        }
      ],
      channelData:[],
      productData:[]
    }
  }

  // componentDidMount(){
  //   let url = 'http://api-test.xinwentuan.com/getdata.php';
  //   axios.post(url)
  //     .then(response =>{
  //       this.setState({
  //         data:response.data
  //       })
  //     })

  //   let url2 = 'http://api-test.xinwentuan.com/product/getdata.php';
  //     axios.post(url2)
  //       .then(response =>{
  //         let arrName = response.data.map((v,i)=>{
  //           let obj = {};
  //           obj.name = v.name;
  //           obj.description = v.description;
  //           return obj;
  //         });
  //         this.setState({
  //           productName:arrName
  //         })
  //       })
  // }

  render(){
    const data = this.state.channelData.length ? this.state.channelData : this.props.channelData;
    return (
      <MaterialTable
        title="渠道表"
        columns={this.state.columns}
        data={data}
        detailPanel={[
          {
            tooltip: '产品连接',
            render: rowData => {
              let list = this.props.productData.map((v,i)=>{
                return (<ListItem key={i} dense={true}>
                    <ListItemText>产品：{v.description}</ListItemText>
                    <ListItemText>连接：https://simcard.jiuyuanxx.com/zop/link/card.html?channel={rowData.name}&product={v.name}&oid=[__OID__]</ListItemText>
                  </ListItem>)
              })
              return (
                <List style={{
                  paddingLeft: '10%',
                  // maxWidth: '80%',
                }}>
                  {list}
                </List>
              )
            },
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize:data.length,
        }}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                axios.post('http://api-test.xinwentuan.com/adddata.php',{
                  data:newData
                })
                .then(response => {
                  console.log(response.data);
                })
                .catch(error => {
                  console.log(error);
                })
                const data = [...this.props.channelData];
                data.push(newData);
                this.setState({channelData:data});
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                // console.log('newData:',newData);
                axios({
                  method: 'post',
                  url: 'http://api-test.xinwentuan.com/updata2.php',
                  data: {
                     name: newData.name,
                     description: newData.description,
                     status: newData.status,
                     id: newData.id,
                  },
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
                const data = [...this.props.channelData];
                data[data.indexOf(oldData)] = newData;
                this.setState({channelData:data});
              }, 600);
            }),
          // onRowDelete: oldData =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       axios.post('http://api-test.xinwentuan.com/deldata.php',{
          //         data:oldData
          //       })
          //       .then(response => {
          //         console.log(response.data);
          //       })
          //       .catch(error => {
          //         console.log(error);
          //       })
          //       const data = [...this.state.channelData];
          //       data.splice(data.indexOf(oldData), 1);
          //       this.setState({ ...this.state, data });
          //     }, 600);
          //   }),
        }}
      />
    );
  }
}



export default ChannelTable;

