import React from 'react';
import MaterialTable from 'material-table';

class DetailsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        columns: [
          { title: 'dt', field: 'dt'},
          { title: 'channelName', field: 'channelName'},
          { title: 'productName', field: 'productName'},
          { title: 'orderId', field: 'orderId' },
          { title: 'openId', field: 'openId' },
          { title: 'State', field: 'state'},
          { title: 'firstPay', field: 'firstPay'},
          { title: 'msgId', field: 'msgId'},
          { title: 'Mobile', field: 'mobile'},
          { title: 'Ctime', field: 'ctime'},
          { title: 'oid', field: 'oid'},
       ],
       data:[],
       title:"",
    }
  }

  render(){
    const data = this.props.data.length ? this.props.data :this.state.data;
    const page = data.length<50?data.length:50;
    return (
      <MaterialTable
        title={this.props.title}
        columns={this.state.columns}
        data={data}
        options={{
          pageSize:page,
          pageSizeOptions:[20,50,100],
        }}
      />
    );
  }
}

export default DetailsTable;
