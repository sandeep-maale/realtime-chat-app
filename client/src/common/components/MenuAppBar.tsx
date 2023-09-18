import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import LoginRegisterComponent from './LoginRegisterComponent';
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '../../config';
import User, { Status } from '../../models/User';
import { setUsers } from '../../redux/store';
import { useDispatch } from 'react-redux';
import MenuAppBarStyles from './MenuAppBar.module.scss'; // Import the SCSS module

export default function MenuAppBar() {
    const [auth, setAuth] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showLoginRegisterDialog, setShowLoginRegisterDialog] = React.useState(false);
    const [dialogType, setDialogType] = React.useState('login');
    // eslint-disable-next-line 
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        const userObj: User | null = cookies.get('user');
        if (userObj) {
            axios.put(`${config.serviceUrl}/users`, { ...userObj, status: Status.Offline })
                .then(response => {
                    if (response && response.status === 200) {
                        cookies.set('user', response.data.find((user: User) => user.email === userObj?.email));
                        dispatch(setUsers(
                            [...response.data]
                        ))
                        cookies.remove('user');
                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error while creating users,', error);
                })
        }

    }
    const handleMenuAction = (type: string) => {
        setShowLoginRegisterDialog(true);
        setDialogType(type);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (cookies && cookies.get('user') && cookies.get('user').email.length > 0) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [cookies])

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" className={MenuAppBarStyles.menuBarTypography} >
                    Realtime Chat Bot
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                        {(auth && cookies.get('user')) && (
                            <Typography variant='subtitle2' className={MenuAppBarStyles.userIconTypography}> {`${cookies.get('user').firstName} ${cookies.get('user').lastName}`}</Typography>
                        )}
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {auth && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
                        {!auth && <MenuItem onClick={() => handleMenuAction('Login')}>Login</MenuItem>}
                        {!auth && <MenuItem onClick={() => handleMenuAction('Register')}>Register</MenuItem>}
                    </Menu>
                </div>
            </Toolbar>
            <LoginRegisterComponent isOpen={showLoginRegisterDialog} dialogType={dialogType} onCloseDialog={() => { setShowLoginRegisterDialog(false) }} onChangeDilogTyope={(dlgType) => setDialogType(dlgType)} />
        </AppBar>
    );
}
