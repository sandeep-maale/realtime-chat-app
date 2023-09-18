import React, { useState, useEffect } from 'react';
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import ChatRoom from '../../models/ChatRoom';
import dayjs from 'dayjs';
import Cookies from 'universal-cookie';

export interface CreateChatRoomComponentProps {
    isOpen: boolean,
    onCloseDialog: () => void,
    onSubmitChatRoom: (chatRoom: ChatRoom) => void

}
export interface field {
    value: string,
    errorState: boolean,
    helperText?: string,
    showPassword?: boolean
}
export interface FormDetails {
    chatRoomName: field,
}

function CreateChatRoomComponent(props: CreateChatRoomComponentProps) {
    const [open, setOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const cookies = new Cookies();

    const resetFormData = () => {
        return {
            chatRoomName: {
                value: '',
                errorState: false,
            }
        }
    }
    const [formData, setFormData] = useState<FormDetails>(resetFormData());

    useEffect(() => {
        setOpen(props.isOpen);
        setIsSuccess(false);
    }, [props]);

    const handleClose = () => {
        setOpen(false);
        props.onCloseDialog();
        setFormData(resetFormData());
    };

    const handleSubmit = () => {
        let isValid = true;
        const formDataCopy = { ...formData }
        if (formData.chatRoomName.value.length === 0) {
            isValid = false
            formDataCopy.chatRoomName.errorState = true;
            formDataCopy.chatRoomName.helperText = 'Please enter valid chat room name.'
        } else {
            formDataCopy.chatRoomName.errorState = false;
            formDataCopy.chatRoomName.helperText = '';
        }

        if (!isValid) {
            setFormData({ ...formDataCopy })
            return false
        } else {
            props.onSubmitChatRoom({
                roomName: formData.chatRoomName.value,
                users: [{...cookies.get('user')}],
                roomId: 0,
                createTimeStamp: dayjs().valueOf()
            });
            setIsSuccess(true);
        }
        //setOpen(false);

    }

    const handleOnChangeFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = event.target;
        setFormData((prevState) => {
            switch (id) {
                case 'chatRoomName':
                    if (prevState.chatRoomName) {
                        prevState.chatRoomName.value = value;
                    } else {
                        prevState.chatRoomName = {
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

    return (
        <>
            <ClickAwayListener onClickAway={(event: MouseEvent | TouchEvent): void => {
                event.preventDefault();
            }}>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{'Create Chat Room'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isSuccess ? `Successfully created chat room! ${formData.chatRoomName.value}` :
                                'Please fill in chat room details below.'}
                        </DialogContentText>
                        <>
                            <TextField
                                margin="dense"
                                id="chatRoomName"
                                label="Chat RoomName Name"
                                type="text"
                                fullWidth
                                value={formData.chatRoomName?.value || ''}
                                error={formData.chatRoomName?.errorState}
                                helperText={formData.chatRoomName?.helperText || ''}
                                onChange={handleOnChangeFormValue}
                                variant="standard"
                            />
                        </>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{isSuccess ? 'Close' : 'Cancel'}</Button>
                        <Button onClick={handleSubmit}>Create</Button>
                    </DialogActions>
                </Dialog>
            </ClickAwayListener>
        </>
    );
}

export default CreateChatRoomComponent;
