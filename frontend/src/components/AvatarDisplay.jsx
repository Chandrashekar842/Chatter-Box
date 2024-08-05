import { Avatar } from '@mui/material';
import React from 'react'

export const AvatarDisplay = ({ name, style }) => {

    function stringToColor(string) {
        let hash = 0;
        let i;
  
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
  
        let color = '#';
  
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
      }

      const color = stringToColor(name)
      
      const newStyles = {...style, backgroundColor: color}

  
    const stringAvatar = (name) => {
      const nameParts = name.split(" ");
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0][0]; // Use the first letter if there's only one word
  
      return {
        sx: {
          backgroundColor: stringToColor(name), // Ensure `stringToColor` function handles names properly
        },
        children: initials.toUpperCase(), // Ensure initials are uppercase
      };
    };
  return (
    <Avatar
          // src={user.pic}
          {...stringAvatar(name)}
          sx={newStyles}
        />
  )
}

// sx={{
//     width: "100px",
//     height: "100px",
//     fontSize: "30px",
//     textTransform: "uppercase",
//     backgroundColor: color
//   }}
