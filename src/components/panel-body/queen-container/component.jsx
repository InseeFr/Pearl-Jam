import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mount } from 'dramaQueen/DramaIndex';
import { useQueenListener } from '../../../utils/hooks/useQueenListener';

const QueenContainer = queenSwState => {
  const wrapperRef = useRef(null);
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
      mountPoint: wrapperRef.current,
      initialPathname: location.pathname.replace('', ''),
    });
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);

  return (
    <>
      {queenSwState && <div ref={wrapperRef} id="drama-queen-mfe" />}
      {!queenSwState && <h2>Queen service-worker not available.</h2>}
    </>
  );
};

export default QueenContainer;
