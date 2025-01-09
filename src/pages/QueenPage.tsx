import { mount } from 'dramaQueen/DramaIndex';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueenListener } from '../utils/hooks/useQueenListener';

const queenPathname = '/queen';

/**
 * Mount Queen to sync data
 */
export default function QueenPage() {
  const ref = useRef(null);
  const location = useLocation();

  const navigate = useNavigate();

  useQueenListener(navigate);

  // Listen to navigation events dispatched inside Drama Queen mfe.
  useEffect(() => {
    const dramaQueenNavigationEventHandler = (event: CustomEvent<unknown>) => {
      const pathname = event.detail;
      const newPathname = `${queenPathname}${pathname}`;
      if (newPathname === location.pathname) {
        return;
      }
      navigate(newPathname);
    };
    window.addEventListener('[Drama Queen] navigated', dramaQueenNavigationEventHandler);

    return () => {
      window.removeEventListener('[Drama Queen] navigated', dramaQueenNavigationEventHandler);
    };
  }, [location]);

  // Listen for Pearl location changes and dispatch a notification.
  useEffect(() => {
    if (location.pathname.startsWith(queenPathname)) {
      window.dispatchEvent(
        new CustomEvent('[Pearl] navigated', {
          detail: location.pathname.replace(queenPathname, ''),
        })
      );
    }
  }, [location]);

  const isFirstRunRef = useRef(true);
  const unmountRef = useRef(() => {});

  useEffect(() => {
    if (!isFirstRunRef.current) {
      return;
    }
    unmountRef.current = mount({
      mountPoint: ref.current,
      initialPathname: location.pathname.replace(queenPathname, ''),
    });
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);

  return <div ref={ref} id="drama-queen-mfe" />;
}
