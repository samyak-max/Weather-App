import { useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useCity } from '../context/cityProvider';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
};

function Card({city, setResolved}) {
    const [open, setOpen] = useState(false);
    const { city1, city2, city3, city4 } = useCity();
    
    useEffect(() => {
        const isAllResolved = city1.isResolved || city2.isResolved || city3.isResolved || city4.isResolved;
        setResolved(isAllResolved);
      }, [city1.isResolved, city2.isResolved, city3.isResolved, city4.isResolved])    

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/city/${city.cityName.toLowerCase()}`);
            console.log('City deleted successfully');
            setOpen(false);
            city.isResolved = false;
        } catch (error) {
            console.error(error);
        }
    }
return (
    <>
    <div 
        className='grid grid-cols-4 p-2 rounded-md border-black border-2 w-max items-center cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out'
        onClick={() => {
            setOpen(true);
        }}
    >
            <div className='col-span-1 flex justify-center items-center'>
                    <img src={city.current.condition.icon} alt={city.current.condition.text}/>
            </div>
            <div className='col-span-3'>
                    <div>
                            <h1 className='text-xl'>{city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1)},</h1>
                            <p>{city.location.region}, {city.location.country}</p>
                    </div>
                    <div>
                            <p>{city.current.condition.text}</p>
                    </div>
                    <div className='flex gap-6'>
                            <h1>Temperature: {city.current.temp_c}°C</h1>
                            <h1>Humidity: {city.current.humidity}%</h1>
                    </div>
            </div>
    </div>
    <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >    
        <Box sx={style}>
            <div className='flex justify-between align-middle mb-3'>
                <div id="modal-modal-title" className='text-center text-xl'>{city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1)}</div>
                <div>
                <IconButton 
                    aria-label="delete"
                    onClick={() => {
                        handleDelete();
                    }}
                >
                    <Trash2 color="red" />
                </IconButton>
                </div>
            </div>
            <p>
                Region: {city.location.region}, {city.location.country}
            </p>
            <p>
                Temperature: {city.current.temperature}°C
            </p>
            <p>
                Humidity: {city.current.humidity}%
            </p>
            <p>
                Wind (kmph): {city.current.wind_kph} {city.current.wind_dir}
            </p>
            <p>
                Precipitation (mm): {city.current.precip_mm}
            </p>
            <p>
                Visibility (km): {city.current.vis_km}
            </p>
            <p>
                Condition: {city.current.condition.text}
            </p>
        </Box>
    </Modal>
    </>
)
}

export default Card