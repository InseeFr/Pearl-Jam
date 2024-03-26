import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useToggle } from '../../utils/hooks/useToggle';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import D from 'i18n';
import { Typography } from '../Typography';
import { useUser } from '../../utils/hooks/useUser';
import { HeaderBackdrop } from './HeaderBackdrop';

export function UserButton() {
  const [hasModal, toggleModal] = useToggle(false);
  const [target, setTarget] = useState(null);
  const handleClick = e => {
    setTarget(e.currentTarget);
    toggleModal();
  };
  const { user } = useUser();
  return (
    <>
      <IconButton title={D.myProfile} id="profile-button" onClick={handleClick}>
        <PersonIcon />
      </IconButton>
      <Popover
        id="basic-menu"
        anchorEl={target}
        open={hasModal}
        onClose={toggleModal}
        aria-labelledby="profile-button"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
            },
          },
        }}
      >
        <Stack gap={1} p={2} sx={{ width: 360 }}>
          <Typography variant="headingM">{D.myProfile}</Typography>
          <Stack bgcolor="surfacePrimary.main" sx={{ borderRadius: 1 }}>
            <List dense>
              <UserLine label={D.profileLastName} value={user.lastName} />
              <UserLine label={D.profileFirstName} value={user.firstName} />
              <UserLine label={D.profileEmail} value={user.email} />
              <UserLine label={D.profilePhone} value={user.phoneNumber} />
            </List>
          </Stack>
        </Stack>
      </Popover>
      <HeaderBackdrop open={hasModal} />
    </>
  );
}

function UserLine({ label, value }) {
  return (
    <ListItem>
      <Typography variant="s" as="span" color="textTertiary">
        {label} :
      </Typography>
      &nbsp;
      <Typography variant="s" as="span" color="textPrimary">
        {value}
      </Typography>
    </ListItem>
  );
}
