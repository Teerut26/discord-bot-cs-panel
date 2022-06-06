import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { ChannelAPI } from "interfaces/ChannelAPI";

interface Props {
    channels: ChannelAPI[];
    defaultValue: ChannelAPI[];
    onSelect?: (value: ChannelAPI[]) => void;
}

const SelectChannel: React.FC<Props> = ({ channels, onSelect,defaultValue }) => {
    return (
        <Stack spacing={3} sx={{ width: "100%" }}>
            <Autocomplete
                multiple
                options={channels}
                onChange={(event, value) => (onSelect ? onSelect(value) : null)}
                defaultValue={defaultValue}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="เลือก Channel"
                        placeholder="channel"
                    />
                )}
            />
        </Stack>
    );
};

export default SelectChannel;
