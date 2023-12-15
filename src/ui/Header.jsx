import Stack from '@mui/material/Stack';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Typography } from './Typography';
import { version } from '../../package.json';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { SynchronizeButton } from './Header/SynchronizeButton';
import { NetworkStatus } from './Header/NetworkStatus';
import { UserButton } from './Header/UserButton';
import { theme } from './PearlTheme';

export function Header() {
  return (
    <Stack
      as="header"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="white.main"
      py={2}
      px={4}
      position="relative"
      zIndex={theme.zIndex.appBar}
    >
      <Stack direction="row" alignItems="center" gap={5}>
        <NavLink activeClassName="active" exact to="/">
          <img
            width={47}
            height={50}
            src="/static/images/logo-insee-header.png"
            alt="Logo Insee"
            style={{ display: 'block' }}
          />
        </NavLink>
        {/* Logo Sabiane */}
        <Stack>
          <Stack direction="row" gap={0.5}>
            <Typography color="primary" variant="headingM" as="span">
              Sabiane
            </Typography>
            <Typography color="accent" variant="headingM" as="span">
              Collecte
            </Typography>
          </Stack>
          <Typography color="hint" variant="xs" as="span" style={{ color: '#BDBDBD' }}>
            V.{version}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap={3}>
        <Button color="typographyprimary">
          <Stack direction="row" gap={1} alignItems="center">
            <Stack
              alignItems="center"
              justifyContent="center"
              as={Paper}
              sx={{ width: 28, height: 28, borderRadius: 28 }}
              elevation={2}
            >
              <FormatListBulletedIcon fontSize="small" />
            </Stack>
            Mon suivi
          </Stack>
        </Button>

        <SynchronizeButton />

        <NetworkStatus />

        <UserButton />
      </Stack>
    </Stack>
  );
}
