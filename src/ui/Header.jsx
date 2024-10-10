import Stack from '@mui/material/Stack';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useEffect, useState } from 'react';
import { Typography } from './Typography';
import { version } from '../../package.json';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import { SynchronizeButton } from './Header/SynchronizeButton';
import { NetworkStatus } from './Header/NetworkStatus';
import D from '../i18n/build-dictionary';
import { UserButton } from './Header/UserButton';
import { useTheme } from '@mui/material/styles';
import { Row } from './Row';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { loadNotifications, useUnreadNotificationsCount } from '../utils/hooks/useNotifications';
import { Notifications } from './Header/Notifications';
import { Link } from 'react-router-dom';

export function Header() {
  const notificationsCount = useUnreadNotificationsCount();
  const [notificationTarget, setNotificationTarget] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

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
        <Link to="/">
          <img
            width={47}
            height={50}
            src="/static/images/logo-insee-header.png"
            alt="Logo Insee"
            style={{ display: 'block' }}
          />
        </Link>
        {/* Logo Sabiane */}
        <Stack>
          <Row gap={0.5} as={Link} sx={{ textDecoration: 'none' }}>
            <Typography color="textPrimary" variant="headingM" as="span">
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
        <HeaderNavLink to="/suivi" icon={FormatListBulletedIcon}>
          {D.goToMyTracking}
        </HeaderNavLink>

        <HeaderNavLink
          onClick={e => setNotificationTarget(e.currentTarget)}
          id="notifications-button"
          icon={NotificationsNoneIcon}
          badge={notificationsCount}
        >
          {D.goToNotificationsPage}
        </HeaderNavLink>

        <Notifications target={notificationTarget} onClose={() => setNotificationTarget(null)} />

        <SynchronizeButton />

        <NetworkStatus />

        <UserButton />
      </Row>
    </Row>
  );
}

function HeaderNavLink({ icon: IconComponent, children, badge = 0, ...props }) {
  return (
    <Badge color="accent" badgeContent={badge}>
      <Button
        component={props.to ? Link : undefined}
        color="textPrimary"
        sx={{ textDecoration: 'none' }}
        {...props}
      >
        <Row gap={1}>
          <Stack
            alignItems="center"
            justifyContent="center"
            as={Paper}
            sx={{ width: 28, height: 28, borderRadius: 28 }}
            elevation={2}
          >
            <IconComponent fontSize="small" />
          </Stack>
          {children}
        </Row>
      </Button>
    </Badge>
  );
}
