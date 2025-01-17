import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Button, { ButtonProps } from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { PropsWithChildren, PropsWithoutRef, ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { version } from '../../package.json';
import D from '../i18n/build-dictionary';
import { loadNotifications, useUnreadNotificationsCount } from '../utils/hooks/useNotifications';
import { NetworkStatus } from './Header/NetworkStatus';
import { Notifications } from './Header/Notifications';
import { SynchronizeButton } from './Header/SynchronizeButton';
import { UserButton } from './Header/UserButton';
import { Row } from './Row';
import { Typography } from './Typography';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export function Header() {
  const notificationsCount = useUnreadNotificationsCount();
  const [notificationTarget, setNotificationTarget] = useState<HTMLElement | null>(null);
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

        <Notifications target={notificationTarget!} onClose={() => setNotificationTarget(null)} />

        <SynchronizeButton />

        <NetworkStatus />

        <UserButton />
      </Row>
    </Row>
  );
}

function HeaderNavLink({
  icon: IconComponent,
  children,
  badge = 0,
  ...props
}: Readonly<
  PropsWithChildren<
    {
      icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
      badge?: number;
      to?: string;
    } & PropsWithoutRef<ButtonProps>
  >
>) {
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
            component={Paper}
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
