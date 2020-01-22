import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 3, 2),
    position:"relative",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 222,
    maxWidth: 222,
  },
  timeForm:{
    margin: theme.spacing(1),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  RadioGroup:{
    position: "absolute",
    right: 185,
    top:0,
    marginTop:80,
  },
  button: {
    width:85,
    position: "absolute",
    right: 50,
    top:100,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormSearch(props) {
  const classes = useStyles();

  const [channel, setChannel] = React.useState(["全部"]);
  const [product, setProduct] = React.useState(["全部"]);
  const [startDate, setStartDate] = React.useState(new Date(new Date()-72*60*60*1000));
  const [endDate, setEndDate] = React.useState(new Date());
  const [method, setMethod] = React.useState('day');
  const { enqueueSnackbar } = useSnackbar();

  function handleChangeChannel(event) {
    setChannel(event.target.value);
    // console.log('channel',event.target.value);
  }
  function handleChangeProduct(event) {
    setProduct(event.target.value);
    // console.log('product',event.target.value);
  }
  function handleChangeStartDate(date) {
    setStartDate(date);
    // console.log('st',date);
  }
  function handleChangeEndDate(date) {
    setEndDate(date);
    // console.log('et',date);
  }
  function handleChangeMthod(event) {
    setMethod(event.target.value);
    // console.log('method',event.target.value);
  }
  function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate()
    return Str
  }
  function btnClick(){
    const c = []; 
    const p = [];
    if (channel.length>0) {
      if (channel.indexOf("全部")>-1) {
        props.channelData.map((j)=>{
          c.push(j.name);
          return c;
        })
      } else {
        channel.map((v)=>{
          props.channelData.map((n)=>{
            if (v === n.description) {
              c.push(n.name);
            }
            return n;
          })
        return c;
        })
      }
    } else {
      enqueueSnackbar('渠道不能为空',{variant: 'warning',autoHideDuration: 1000,});
      return ;
    };
    if (product.length>0) {
      if (product.indexOf("全部")>-1) {
        props.productData.map((n)=>{
          p.push(n.name);
          return c;
        })
      } else {
        product.map((v)=>{
          props.productData.map((n)=>{
            if (v === n.description) {
              p.push(n.name);
            }
            return n;
          })
          return v;
        })
      }
    } else {
      enqueueSnackbar('产品不能为空',{variant: 'warning',autoHideDuration: 1000,});
      return ;
    };

    const st = GMTToStr(startDate)+" 0:00:00";
    const et = GMTToStr(endDate)+" 23:59:59";

    console.log('post->channel:',c);
    console.log('product:',p);
    console.log('startDate:',st);
    console.log('endState:',et);
    console.log('method:',method);
    axios({
      method: 'post',
      url: 'http://api-test.xinwentuan.com/records/getdata3.php',
      data: {
        channel: c,
        product: p,
        startDate: st,
        endDate: et,
        method: method,
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
    .then(response => {
      if (response.data === 'err') {
        enqueueSnackbar('未搜索到相应数据',{variant: 'error',autoHideDuration: 1000,});      
      } else {
        console.log("筛选后数据：",response.data);
        props.searchBtn(response.data);      
      }
    })
  }

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="select-multiple-checkbox">渠道</InputLabel>
        <Select
          multiple
          value={channel}
          onChange={handleChangeChannel}
          input={<Input id="select-multiple-checkbox" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          <MenuItem key="全部" value="全部">
            <Checkbox checked={channel.indexOf("全部") > -1} />
            <ListItemText primary="全部" />
          </MenuItem>
          {props.channelData.map(v => (
            <MenuItem key={v.description} value={v.description}>
              <Checkbox checked={channel.indexOf(v.description) > -1} />
              <ListItemText primary={v.description} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="select-product">产品</InputLabel>
        <Select
          multiple
          value={product}
          onChange={handleChangeProduct}
          input={<Input id="select-product" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          <MenuItem key="全部" value="全部">
            <Checkbox checked={product.indexOf("全部") > -1} />
            <ListItemText primary="全部" />
          </MenuItem>
          {props.productData.map(v => (
            <MenuItem key={v.description} value={v.description}>
              <Checkbox checked={product.indexOf(v.description) > -1} />
              <ListItemText primary={v.description} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl className={classes.timeForm}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="开始日期"
          value={startDate}
          onChange={handleChangeStartDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
      </FormControl>
      <FormControl className={classes.timeForm}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="结束日期"
          value={endDate}
          onChange={handleChangeEndDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
      </FormControl>
      <FormControl className={classes.RadioGroup}>
        <FormLabel component="legend">统计方式</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          className={classes.group}
          value={method}
          onChange={handleChangeMthod}
          row
        >
          <FormControlLabel value="day" control={<Radio color="primary" />} label="天" />
          <FormControlLabel value="total" control={<Radio color="primary" />} label="合计" />
        </RadioGroup>
      </FormControl>
      <Button 
      variant="contained" 
      color="primary" 
      className={classes.button} 
      onClick={btnClick}
      >搜索</Button>
    </div>
  );
}