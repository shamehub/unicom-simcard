import React from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        columns: [
          { title: 'Name', field: 'name' },
          { title: 'Description', field: 'description' },
          { title: 'Url', field: 'url'},
          { title: 'minFirstPay', field: 'minFirstPay'},
          { title: 'Status', field: 'status', lookup: { 1 :"有效", 0:"无效"} }
        ],
      data: []
    }
  }

  // componentDidMount(){
  //   let url = 'http://api-test.xinwentuan.com/product/getdata.php';
  //   axios.post(url)
  //     .then(response =>{
  //       this.setState({
  //         data:response.data
  //       })
  //     })
  // }

  render(){
    const data = this.state.data.length ? this.state.data : this.props.productData;
    return (
      <MaterialTable
        title="产品表"
        columns={this.state.columns}
        data={data}
        options={{
          actionsColumnIndex: -1,
          pageSize:data.length,
        }}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                axios.post('http://api-test.xinwentuan.com/product/adddata.php',{
                  data:newData
                })
                .then(response => {
                  console.log(response.data);
                })
                .catch(error => {
                  console.log(error);
                })
                const data = [...this.props.productData];
                data.push(newData);
                this.setState({ ...this.state, data});
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                axios({
                  method: 'post',
                  url: 'http://api-test.xinwentuan.com/product/updata.php',
                  data: {
                     name: newData.name,
                     description: newData.description,
                     url: newData.url,
                     minFirstPay: newData.minFirstPay,
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
                const data = [...this.props.productData];
                data[data.indexOf(oldData)] = newData;
                this.setState({ ...this.state, data });
              }, 600);
            }),
          // onRowDelete: oldData =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       axios.post('http://api-test.xinwentuan.com/product/deldata.php',{
          //         data:oldData
          //       })
          //       .then(response => {
          //         console.log(response.data);
          //       })
          //       .catch(error => {
          //         console.log(error);
          //       })
          //       const data = [...this.state.data];
          //       data.splice(data.indexOf(oldData), 1);
          //       this.setState({ ...this.state, data });
          //     }, 600);
          //   }),
        }}
      />
    );
  }
}

export default ProductTable;
