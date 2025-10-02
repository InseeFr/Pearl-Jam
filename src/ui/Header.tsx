import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { SvgIconTypeMap } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button, { ButtonProps } from '@mui/material/Button';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import {
  forwardRef,
  PropsWithChildren,
  PropsWithoutRef,
  useContext,
  useEffect,
  useRef,
} from 'react';
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
import { SyncContext } from './Sync/SyncContextProvider';

export function Header() {
  const notificationsCount = useUnreadNotificationsCount();
  const { notificationOpened, setNotificationOpened } = useContext(SyncContext);
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

  console.log(ref.current);
  return (
    <Row
      component="header"
      justifyContent="space-between"
      bgcolor="white.main"
      py={2}
      px={4}
      position="relative"
      zIndex={theme.zIndex.appBar}
    >
      <Row gap={5}>
        <Link to="/">
          <h1>
            <img
              width={150}
              height={50}
              src="/static/images/Insee_logo_header.webp"
              alt="Logo Insee"
              style={{ display: 'block' }}
            />
          </h1>
        </Link>
        {/* Logo Sabiane */}
        <Stack>
          <Row gap={0.5} component={Link} sx={{ textDecoration: 'none' }}>
            <Typography color="textPrimary" variant="headingM" component="span">
              Sabiane
            </Typography>
            <Typography color="accent" variant="headingM" component="span">
              Collecte
            </Typography>
          </Row>
          <Typography color="hint" variant="xs" component="span">
            V.{version}
          </Typography>
        </Stack>
      </Row>
      <Row gap={3}>
        <HeaderNavLink to="/suivi" icon={FormatListBulletedIcon}>
          {D.goToMyTracking}
        </HeaderNavLink>

        <HeaderNavLink
          ref={ref}
          onClick={e => setNotificationOpened('NORMAL')}
          id="notifications-button"
          icon={NotificationsNoneIcon}
          badge={notificationsCount}
        >
          {D.goToNotificationsPage}
        </HeaderNavLink>

        <Notifications
          target={ref.current!}
          open={!!notificationOpened}
          onClose={() => setNotificationOpened(false)}
        />

        <SynchronizeButton />

        <NetworkStatus />

        <UserButton />
      </Row>
    </Row>
  );
}

const HeaderNavLink = forwardRef(function (
  {
    icon: IconComponent,
    children,
    badge = 0,
    ...props
  }: Readonly<
    PropsWithChildren<
      {
        icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
        badge?: number;
        to?: string;
      } & PropsWithoutRef<ButtonProps>
    >
  >,
  ref
) {
  return (
    <Badge color="accent" badgeContent={badge}>
      <Button
        ref={ref}
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
});
