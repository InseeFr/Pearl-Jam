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
import { Row } from './Row';

export function Header() {
  return (
    <Row
      as="header"
      justifyContent="space-between"
      bgcolor="white.main"
      py={2}
      px={4}
      position="relative"
      zIndex={theme.zIndex.appBar}
    >
      <Row gap={5}>
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
          <Row gap={0.5}>
            <Typography color="primary" variant="headingM" as="span">
              Sabiane
            </Typography>
            <Typography color="accent" variant="headingM" as="span">
              Collecte
            </Typography>
          </Row>
          <Typography color="hint" variant="xs" as="span" style={{ color: '#BDBDBD' }}>
            V.{version}
          </Typography>
        </Stack>
      </Row>
      <Row gap={3}>
        <Button color="typographyprimary">
          <Row gap={1}>
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
          </Row>
        </Button>

        <SynchronizeButton />

        <NetworkStatus />

        <UserButton />
      </Row>
    </Row>
  );
}
