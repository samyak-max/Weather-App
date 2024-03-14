import React from 'react'
import IconButton from '@mui/material/IconButton';
import { Settings, Feather, BellPlus } from 'lucide-react'
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Setting from './Setting';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import { useCity } from '../context/cityProvider';
import TextField from '@mui/material/TextField';
import axios from 'axios';

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

function Header() {
    const { city1, city2, city3, city4 } = useCity();
    const [cityNumber, setCityNumber] = useState("1");
    const handleCityNumber = (event, newCityNumber) => {
        setCityNumber(newCityNumber);
    }
    const [notifCity, setNotifCity] = useState({
        city: "",
        condition: ""
    });
    const notificationHandler = async() => {
        const uuid = localStorage.getItem('token');
        try{
            const res = await axios.post('http://localhost:3000/notification', { 
                uuid,
                city: notifCity.city,
                condition: notifCity.condition
            });
            console.log(res);
        }
        catch(error){
            console.log(error)
        }
    }
    const bulkCall = async () => {
        const body = {
            "locations": [
                {
                    "q": city1.cityName,
                    "customId": city1.customId
                },
                {
                    "q": city2.cityName,
                    "customId": city2.customId
                },
                {
                    "q": city3.cityName,
                    "customId": city3.customId
                },
                {
                    "q": city4.cityName,
                    "customId": city4.customId
                }
            ]
        }
        console.log(body);
        // const res = await axios.get('http://localhost:3000/weather', body);
        // console.log(res);
    }
    const [open, setOpen] = useState(false);
    const [notificationModal, setNotificationModal] = useState(false);
  return (
    <div className='flex justify-between p-4 h-[10vh]'>
        <div>
            <Feather />
        </div> 
        <div className='flex'>
            <div className='flex gap-2'>
            <IconButton aria-label="settings" onClick={() => setOpen(true)}>
                <Settings/>
            </IconButton>
            <IconButton aria-label="settings" onClick={() => setNotificationModal(true)}>
                <BellPlus />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="flex justify-center">
                        <h1 className='text-lg'>Settings</h1>
                    </div>
                    <TabContext value={cityNumber}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleCityNumber} aria-label="city number tab">
                            <Tab label="City 1" value="1" />
                            <Tab label="City 2" value="2" />
                            <Tab label="City 3" value="3" />
                            <Tab label="City 4" value="4" />
                        </TabList>
                        </Box>
                        <TabPanel value="1"><Setting cityNumber={"1"}/></TabPanel>
                        <TabPanel value="2"><Setting cityNumber={"2"}/></TabPanel>
                        <TabPanel value="3"><Setting cityNumber={"3"}/></TabPanel>
                        <TabPanel value="4"><Setting cityNumber={"4"}/></TabPanel>
                    </TabContext>
                </Box>
            </Modal>
            <Modal
                open={notificationModal}
                onClose={() => setNotificationModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="flex justify-center">
                        <h1 className='text-lg'>Set Notifications</h1>
                    </div>
                    <div className='flex flex-col gap-2 mt-6 mb-6'>
                        <TextField id="city-name" label="City Name" variant="outlined" fullWidth
                            onChange={(e) => setNotifCity({...notifCity, city: e.target.value})}
                        />
                        <TextField id="condition" label="Condition" variant="outlined" fullWidth
                            onChange={(e) => setNotifCity({...notifCity, condition: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={() => notificationHandler()}>Save</Button>
                    </div>
                </Box>
            </Modal>
            </div>
        </div>
    </div>
  )
}

export default Header