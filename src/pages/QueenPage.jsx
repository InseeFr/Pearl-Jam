import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mount } from 'dramaQueen/DramaIndex';
import { useQueenListener } from '../utils/hooks/useQueenListener';

/**
 * Mount Queen to sync data
 * @returns {JSX.Element}
 * @constructor
 */
export function QueenPage() {
  /** @var {import('react').Ref<HTMLDivElement>} ref */
  const ref = useRef(null);
  const location = useLocation();

  const navigate = useNavigate();
  useQueenListener(navigate);

  const isFirstRunRef = useRef(true);
  const unmountRef = useRef(() => {});

  useEffect(() => {
    if (!isFirstRunRef.current) {
      return;
    }
    unmountRef.current = mount({
      mountPoint: ref.current,
    });
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);

  return <div ref={ref} id="drama-queen-mfe" />;
}
