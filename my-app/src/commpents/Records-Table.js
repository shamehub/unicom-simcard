import React from 'react';
import MaterialTable ,{ MTableToolbar }from 'material-table';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import FormSearch from './Form-Search';
import { withSnackbar } from 'notistack';

class RecordsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        columnsDay: [
          { title: '日期', field: 'date'},
          { title: '渠道', field: 'channel'},
          { title: '产品', field: 'product'},
          { title: '效果数', field: 'count'},
       ],
       columnsTotal: [
        { title: '渠道', field: 'channel'},
        { title: '产品', field: 'product'},
        { title: '效果数', field: 'count'},
      ],
      data: []
    }
  }

  componentDidMount(){
    let url = 'http://api-test.xinwentuan.com/records/getdata.php';
    axios.post(url)
      .then(response =>{
        this.setState({
          data:response.data
        })
      })
  }

  handleChange(event,rowData){
    this.props.handleChange(event,3);
    this.props.setRecordsDetails(rowData);
  }

  searchBtn(data){
    this.setState({data:data})
  }

  render(){
    let columns = [];
    if (this.state.data.length) {
      columns = this.state.data[0].date?this.state.columnsDay:this.state.columnsTotal;
    }
    const page = this.state.data.length<50?this.state.data.length:50;

    return (
      <MaterialTable
        title="统计"
        columns={columns}
        data={this.state.data}
        options={{
          actionsColumnIndex: -1,
          pageSize:page,
          pageSizeOptions:[20,50,100],
          exportButton: true,
          exportCsv: (columns, data) => {
            this.props.enqueueSnackbar('未开放',{variant: 'warning',autoHideDuration: 1500,});
          }
        }}
        actions={[
          {
            icon: 'save',
            tooltip: '详情',
            onClick: (event,rowData) => this.handleChange(event,rowData)
          }
        ]}
        components={{
          Action: props => (
            <Button
              onClick={(event) => props.action.onClick(event, props.data)}
              color="primary"
              variant="contained"
              style={{textTransform: 'none'}}
              size="small"
            >
              详情
            </Button>
          ),
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <FormSearch 
                channelData={this.props.channelData}
                productData={this.props.productData}
                searchBtn={this.searchBtn.bind(this)}
              />
            </div>
          ),
        }}
      />
    );
  }
}

export default withSnackbar(RecordsTable);
