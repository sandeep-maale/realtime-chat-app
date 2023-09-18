import { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';
import MenuAppBar from './common/components/MenuAppBar';
import ChatView from './views/ChatView';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setChatRooms, setUsers } from './redux/store';
import AppStyles from './App.module.scss'; // Import the SCSS module

function App() {

  // eslint-disable-next-line 
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds 
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    // Fetch users calling API endpoint
    await axios.get(`${config.serviceUrl}/users`)
      .then(response => {
        if (response?.data.length > 0) {
          dispatch(setUsers(response.data))
        }
      })
      .catch(error => {
        console.error('Error fetching users data:', error);
      });
  }

  const fetchChatRooms = async () => {
    // Fetch users calling API endpoint
    await axios.get(`${config.serviceUrl}/chatRooms`)
      .then(response => {
        if (response?.data) {
          dispatch(setChatRooms(response.data))
        }
      })
      .catch(error => {
        console.error('Error fetching users data:', error);
      });
  }

  // Effect to fetch data initially and then at regular intervals
  useEffect(() => {
    fetchUsers();
    fetchChatRooms();

    const intervalId = setInterval(() => {
       // Fetch data at regular intervals
      fetchUsers();
      fetchChatRooms();

      // Optionally, you can change the refresh interval dynamically
      // setRefreshInterval(newInterval);
    }, refreshInterval);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]); // Dependencies array to re-run the effect when the interval changes

  return (
    <Grid container className={AppStyles.appContainer}>
      <Grid item>
        <MenuAppBar />
      </Grid>
      <ChatView />
    </Grid>
  );
}

export default App;
