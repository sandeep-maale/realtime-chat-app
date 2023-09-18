import React, { useState, useEffect } from 'react';
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { isStrongPassword, isValidEmail, isValidName } from '../../utills/Utills';
import { useDispatch } from 'react-redux';
import { setUsers } from '../../redux/store';
import User, { Status } from '../../models/User';
import axios from 'axios';
import config from '../../config';
import Cookies from 'universal-cookie';

export interface LoginRegisterProps {
    isOpen: boolean,
    dialogType: string,
    onCloseDialog: () => void;
    onChangeDilogTyope: (dlgType: string) => void;
}
export interface field {
    value: string,
    errorState: boolean,
    helperText?: string,
    showPassword?: boolean
}
export interface FormDetails {
    firstName?: field,
    lastName?: field,
    email: field,
    password: field,
    verifyPassword: field
}

function LoginRegisterComponent(props: LoginRegisterProps) {
    const [open, setOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const dispatch = useDispatch();
    const cookies = new Cookies();

    const resetFormData = () => {
        return {
            firstName: {
                value: '',
                errorState: false,
            },
            lastName: {
                value: '',
                errorState: false,
            },
            email: {
                value: '',
                errorState: false,
            },
            password: {
                value: '',
                errorState: false,
                showPassword: false
            },
            verifyPassword: {
                value: '',
                errorState: false,
                showPassword: false
            }
        }
    }
    const [formData, setFormData] = useState<FormDetails>(resetFormData());

    useEffect(() => {
        setOpen(props.isOpen);

    }, [props]);

    const handleClose = () => {
        setOpen(false);
        setIsSuccess(false);
        setFormData(resetFormData());
        props.onCloseDialog();
    };

    const createUser = async (user: User) => {
        // Create user 
        await axios.post(`${config.serviceUrl}/users`, user)
            .then(response => {
                if (response?.data.length > 0) {
                    setIsSuccess(true);
                    dispatch(setUsers(
                        [...response.data]
                    ))
                }
            })
            .catch(error => {
                console.error('Error while creating users,', error);

            });
    }

    const login = async (email: string, password: string) => {
        let userObj: User | null;
        await axios.get(`${config.serviceUrl}/user?email=${email}&password=${password}`)
            .then(response => {
                if (response && response.status === 200) {
                    setIsSuccess(true);
                    userObj = { ...response.data };
                    cookies.set('user', { ...response.data });
                } else if (response && response.status === 400) {
                    setIsSuccess(false);
                    console.error('Password did not match, please enter a valid password');
                }
                else if (response && response.status === 404) {
                    setIsSuccess(false);
                    console.error('User not found, please register and login.');
                }
                else {
                    setIsSuccess(false);
                    console.error('Error occurred while validating user.');
                }
            }).then(() => {
                if (userObj) {
                    axios.put(`${config.serviceUrl}/users`, { ...userObj, status: Status.Online })
                        .then(response => {
                            if (response && response.status === 200) {
                                cookies.set('user', response.data.find((user: User) => user.email === userObj?.email));
                                dispatch(setUsers(
                                    [...response.data]
                                ))
                                window.location.reload();
                            }
                        })
                        .catch(error => {
                            console.error('Error while updating users,', error);
                        })
                }
            }).catch(error => {
                console.error('Error while creating users,', error);
            })
    }

    const handleSubmit = () => {
        let isValid = true;
        const formDataCopy = { ...formData }
        if (formData.email.value.length === 0 || !isValidEmail(formData.email.value)) {
            isValid = false
            formDataCopy.email.errorState = true;
            formDataCopy.email.helperText = 'Please enter a valid email ID.'
        } else {
            formDataCopy.email.errorState = false;
            formDataCopy.email.helperText = '';
        }
        if (formData.password.value.length === 0 || !isStrongPassword(formData.password.value)) {
            isValid = false
            formDataCopy.password.errorState = true;
            formDataCopy.password.helperText = 'Please enter a valid password, make sure to follow below criteria: \n Minimum length (e.g., 8 characters).\n At least one uppercase letter (A-Z).\n At least one lowercase letter (a-z).\n At least one digit (0-9).\n At least one special character (e.g., !@#$%^&*).'
        } else {
            formDataCopy.password.errorState = false;
            formDataCopy.password.helperText = '';
        }
        if (props.dialogType === 'Register' && !formDataCopy.password.errorState && (formData.verifyPassword.value.length === 0 || (formData.password.value !== formData.verifyPassword.value))) {
            isValid = false
            formDataCopy.verifyPassword.errorState = true;
            formDataCopy.verifyPassword.helperText = 'Please make sure to verify password is matching.';
        } else {
            formDataCopy.verifyPassword.errorState = false;
            formDataCopy.verifyPassword.helperText = '';
        }
        if (props.dialogType === 'Register' && formData.firstName && (formData.firstName.value.length === 0 || !isValidName(formData.firstName.value))) {
            isValid = false
            if (formDataCopy.firstName) {
                formDataCopy.firstName.errorState = true;
                formDataCopy.firstName.helperText = 'Please enter a valid firstName.'
            }
        }
        else {
            if (formDataCopy.firstName) {
                formDataCopy.firstName.errorState = false;
                formDataCopy.firstName.helperText = '';
            }
        }
        if (props.dialogType === 'Register' && formData.lastName && (formData.lastName.value.length === 0 || !isValidName(formData.lastName.value))) {
            isValid = false
            if (formDataCopy.lastName) {
                formDataCopy.lastName.errorState = true;
                formDataCopy.lastName.helperText = 'Please enter a valid lastName.'
            }
        }
        else {
            if (formDataCopy.lastName) {
                formDataCopy.lastName.errorState = false;
                formDataCopy.lastName.helperText = '';
            }
        }

        if (!isValid) {
            setFormData({ ...formDataCopy })
            return false
        } else {
            if (props.dialogType === 'Register') {
                createUser({
                    firstName: formData.firstName?.value || '',
                    lastName: formData.lastName?.value || '',
                    email: formData.email.value,
                    password: formData.password.value || '',
                    status: Status.Offline
                })
            }
            else {
                login(formData.email.value, formData.password.value || '')
            }

            //setOpen(false);
        }

    }

    const handleOnChangeFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = event.target;
        setFormData((prevState) => {
            switch (id) {
                case 'firstName':
                    if (prevState.firstName) {
                        prevState.firstName.value = value;
                    } else {
                        prevState.firstName = {
                            value: value,
                            errorState: false
                        }
                    }
                    break;
                case 'lastName':
                    if (prevState.lastName) {
                        prevState.lastName.value = value;
                    } else {
                        prevState.lastName = {
                            value: value,
                            errorState: false
                        }
                    }
                    break;
                case 'email':
                    if (prevState.email) {
                        prevState.email.value = value;
                    } else {
                        prevState.email = {
                            value: value,
                            errorState: false
                        }
                    }
                    break;
                case 'password':
                    if (prevState.password) {
                        prevState.password.value = value;
                    } else {
                        prevState.password = {
                            value: value,
                            errorState: false
                        }
                    }
                    break;
                case 'verifyPassword':
                    if (prevState.verifyPassword) {
                        prevState.verifyPassword.value = value;
                    } else {
                        prevState.verifyPassword = {
                            value: value,
                            errorState: false
                        }
                    }
                    break;
                default:
                    break;
            }
            return { ...prevState }
        })
    }
    const handleTogglePasswordVisibility = (field: string) => {
        setFormData((prevState) => {
            if (field === 'password') {
                prevState.password.showPassword = !prevState.password.showPassword;
            } else {
                prevState.verifyPassword.showPassword = !prevState.verifyPassword.showPassword;
            }
            return { ...prevState }
        })
    };

    return (
        <>
            <ClickAwayListener onClickAway={(event: MouseEvent | TouchEvent): void => {
                event.preventDefault();
            }}>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{props.dialogType === 'Register' ? 'Register' : 'Login'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isSuccess ? `Welcome to Chat Bot! ${formData.firstName?.value} ${formData.lastName?.value}` : props.dialogType === 'Register' ?
                                'Please fill registration form and submit to get started with Chat Bot.' :
                                'Please login to the Chat Bot.'}
                        </DialogContentText>
                        {(props.dialogType === 'Register' && !isSuccess) ? (
                            <>
                                <TextField

                                    margin="dense"
                                    id="firstName"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    value={formData.firstName?.value || ''}
                                    error={formData.firstName?.errorState}
                                    helperText={formData.firstName?.helperText || ''}
                                    onChange={handleOnChangeFormValue}
                                    variant="standard"
                                />
                                <TextField

                                    margin="dense"
                                    id="lastName"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    value={formData.lastName?.value || ''}
                                    error={formData.lastName?.errorState}
                                    helperText={formData.lastName?.helperText || ''}
                                    onChange={handleOnChangeFormValue}
                                    variant="standard"
                                />
                            </>) : null
                        }

                        {!isSuccess && <TextField

                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={formData.email?.value || ''}
                            error={formData.email?.errorState}
                            helperText={formData.email?.helperText || ''}
                            onChange={handleOnChangeFormValue}
                            variant="standard"
                        />}
                        {!isSuccess && <TextField

                            margin="dense"
                            id="password"
                            label="Password"
                            type={formData.password.showPassword ? 'text' : 'password'}
                            fullWidth
                            value={formData.password?.value || ''}
                            error={formData.password?.errorState}
                            helperText={formData.password?.helperText || ''}
                            onChange={handleOnChangeFormValue}
                            variant="standard"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => { handleTogglePasswordVisibility('password') }}
                                            edge="end"
                                        >
                                            {formData.password.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />}
                        {(props.dialogType === 'Register' && !isSuccess) ? (
                            <TextField
                                margin="dense"
                                id="verifyPassword"
                                label="Verify Password"
                                type={formData.verifyPassword.showPassword ? 'text' : 'password'}
                                fullWidth
                                value={formData.verifyPassword?.value || ''}
                                error={formData.verifyPassword?.errorState}
                                helperText={formData.verifyPassword?.helperText || ''}
                                onChange={handleOnChangeFormValue}
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => { handleTogglePasswordVisibility('verifyPassword') }}
                                                edge="end"
                                            >
                                                {formData.verifyPassword.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />) : null}
                        {props.dialogType === 'Login' && <Typography variant='body2' padding={'12px 0'}>New to Chat Bot please <Link onClick={() => props.onChangeDilogTyope('Register')} underline='hover'>register</Link></Typography>}
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleClose}>{isSuccess ? 'Close' : 'Cancel'}</Button>
                        {!isSuccess && <Button onClick={handleSubmit}>{props.dialogType}</Button>}
                    </DialogActions>
                </Dialog>
            </ClickAwayListener>
        </>
    );
}

export default LoginRegisterComponent;
