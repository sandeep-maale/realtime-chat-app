import { Autocomplete, Chip, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import User, { Status } from "../../models/User";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export interface typeAheadProps {
    userList: User[];
    chatRoomUsers: User[];
    onUpdateChatRoomUsers: (users: User[]) => void;
}

const AutoCompleteUsers = (props: typeAheadProps) => {
    const [selectedOptions, setSelectedOptions] = useState<User[]>([]);

    const handleSelect = (event: any, newValue: any) => {
        setSelectedOptions(newValue); // This will be an array of selected options
        props.onUpdateChatRoomUsers(newValue);
    };

    useEffect(() => {
        if (props.chatRoomUsers) {
            setSelectedOptions([...props.chatRoomUsers]);
        }
    }, [props.chatRoomUsers])
    return (
        <Autocomplete
            fullWidth
            multiple
            autoComplete
            id="autocomplete-chip"
            options={props.userList}
            value={selectedOptions}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option.email === value.email}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip key={option.email} label={`${option.firstName} ${option.lastName}`} color={props.userList.find((user)=> user.email === option.email)?.status === Status.Online ? 'success' : 'default'} icon={<AccountCircleIcon />} />
                ))
            }
            renderInput={(params) => (
                <TextField placeholder='Select users' {...params} variant="outlined" />
            )}
            onChange={handleSelect}
            includeInputInList
        />
    );
}

export default AutoCompleteUsers;


