import TextField from '@mui/material/TextField';
import { useCity } from '../context/cityProvider';
import { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

function Setting( cityNumber ) {
    const { setCity1, setCity2, setCity3, setCity4, city1, city2, city3, city4 } = useCity();
    const [cityName, setCityName] = useState("");
    const [customId, setCustomId] = useState("");
    const handleChanges = async() => {
      let city = {};
      await axios.get('http://localhost:3000/weather/city', {
      params: {
        q: cityName,
        customId: customId
      }
      })
      .then((response) => {
        console.log(response.data);
        city = response.data;
        if(cityNumber.cityNumber === "1") {
            setCity1(cityName, customId, true, city.current, city.location);
            console.log(city1);
          } else if(cityNumber.cityNumber === "2") {
            setCity2(cityName, customId, true, city.current, city.location);
            console.log(city2);
          } else if(cityNumber.cityNumber === "3") {
            setCity3(cityName, customId, true, city.current, city.location);
            console.log(city3);
          } else if(cityNumber.cityNumber === "4") {
            setCity4(cityName, customId, true, city.current, city.location);
            console.log(city4); 
          }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    return (
      <div>
        <div className='mt-2'>
            <TextField 
              onChange={(e) => {
                setCityName(e.target.value);
              }}
              id="city-name" 
              label="City Name" 
              variant="outlined" 
              placeholder="Enter City Name."
              fullWidth
            />
        </div>
        <div className='mt-2'>
            <TextField 
              onChange={(e) => {
                setCustomId(e.target.value);
              }}
              id="custom-id" 
              label="Custom Id" 
              variant="outlined" 
              placeholder="Enter Custom Id. By default it's city name." 
              fullWidth
            />
        </div>
        <Button onClick={() => {handleChanges()}}>Save</Button>

      </div>
    )
}

export default Setting