import React, { useState, useRef  } from 'react';
import './App.css';

// component
import { Input, Button } from 'reactstrap';
import { Toast } from 'primereact/toast';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import axios from 'axios';


const App = () => {
  const toast = useRef(null);
  const [dataInput, setDataInput] = useState('');
  const [data, setData] = useState([]);


  const disPlayInformation = (type, content) => {
      toast.current.show(
        {
          severity: type, 
          detail: content, 
          life: 3000}
        );
  }

  const onHandleChange = (event) => {
    setDataInput(event.target.value);
  }

  const onHandldeKeyDown = (e) => {
    if(e.keyCode === 13) {
      setData(data.concat(dataInput));
      setDataInput('');
    }
  }

  const onDelete = (index) => {
    const dataNew = [...data];
    const lenghtStart = dataNew.length;

    dataNew.splice(index, 1);
    setData(dataNew);

    const lenghtEnd = dataNew.length;

    if(lenghtEnd === lenghtStart-1) {
      disPlayInformation("success","Delete Successful");  
    } else {
      disPlayInformation("error","Delete Failer");
    // toast.current.show(
    //   {
    //     severity:'error', 
    //     detail:'Delete Failer', 
    //     life: 3000}
    //   );
    } 
  }

  const onHandleChangeCheckBox = async (event, index) => {
    if(event.target.checked === true) {
      console.log("call API");
      const URL = "http://localhost:3000/data";
      try {
        const respose = await axios.post(URL, { name: data[index] });
          console.log(respose);
          disPlayInformation("success",`Update Successful - Status: ${respose.status} - statusText: ${respose.statusText}`); 
      } catch (error) {
          console.log(error);
          disPlayInformation("error",`Update Failer - Error: ${error}`); 
      }

    } else {
      console.log("No Call API");
    }

  }

  return (
    <div className="App" >
      
      <Toast ref={ toast } /> 

      <h1>Please typing data</h1>
      <Input
        className="input-size"
        value={ dataInput }
        placeholder="Please typing data" 
        type="text"
        onChange={(event) => onHandleChange(event)}
        onKeyDown={(e) => onHandldeKeyDown(e)}
      />
      <br />
      {
        data.map((dataEnter, index) => {
          return (
            <div key={ index } className="display-data">
              <Input 
                type="checkbox"
                onClick={(event) => onHandleChangeCheckBox(event, index)}
                />
              <span>  { dataEnter } </span>
              <Button 
                color="danger" 
                size="sm"  
                className="ml-30"
                onClick={ () => onDelete(index) }
                
                > Delete </Button>
            </div>
          )
        })
      }

      

    </div>
  )
}

export default App;
