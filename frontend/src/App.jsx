import './App.css'
import Cities from './components/Cities.jsx'
import Header from './components/Header.jsx'
import { CityProvider } from './context/cityProvider.jsx'
import { ThemeProvider } from './context/themeProvider.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
socket.on('notification', (message) => {
  console.log('New notification:', message);
  alert(message);
});

function App() {
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    const getJWT = async () => {
      const uuid = uuidv4();
      try {
        const response = await axios.post('http://localhost:3000/auth/jwt', { uuid });
        setJwt(response.data.token);
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        console.error(error);
      }
    }
    getJWT();
  }, []);

  useEffect(() => {
    if (jwt) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }
  }, [jwt]);

  const [cityNumber, updateCityNumber] = useState("1");
  const [city1, updateCity1] = useState({
    cityName: "",
    customId: "",
    isResolved: false,
    current: {},
    location: {}
  });
  const [city2, updateCity2] = useState({
    cityName: "",
    customId: "",
    isResolved: false,
    current: {},
    location: {}
  });
  const [city3, updateCity3] = useState({
    cityName: "",
    customId: "",
    isResolved: false,
    current: {},
    location: {}
  });
  const [city4, updateCity4] = useState({
    cityName: "",
    customId: "",
    isResolved: false,
    current: {},
    location: {}
  });
  const setCityNumber = (newCityNumber) => {
    updateCityNumber(newCityNumber);
  }
  const setCity1 = (cityName, customId, isResolved, current, location) => {
    updateCity1({cityName, customId, isResolved, current, location});
  }
  const setCity2 = (cityName, customId, isResolved, current, location) => {
    updateCity2({cityName, customId, isResolved, current, location});
  }
  const setCity3 = (cityName, customId, isResolved, current, location) => {
    updateCity3({cityName, customId, isResolved, current, location});
  }
  const setCity4 = (cityName, customId, isResolved, current, location) => {
    updateCity4({cityName, customId, isResolved, current, location});
  }
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CityProvider value={ {cityNumber, setCityNumber, city1, city2, city3, city4, setCity1, setCity2, setCity3, setCity4} }>
          <Header />
          <Cities />
        </CityProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
