import React, { useEffect, useRef } from 'react';
import { useQueenListener } from 'utils/hooks/useQueenListener';
import { useNavigate, useLocation } from 'react-router-dom';

const QueenContainer = queenSwState => {
  const wrapperRef = useRef(null);
  const location = useLocation();

  useQueenListener(useNavigate());

  const isFirstRunRef = useRef(true);
  const unmountRef = useRef(() => {});

  useEffect(() => {
    if (!isFirstRunRef.current) {
      return;
    }
    // unmountRef.current = mount({
    //   mountPoint: wrapperRef.current,
    //   //For the future we should have location.pathname.replace('queen', '') and remove useless /queen in queens routes
    //   initialPathname: location.pathname.replace('', ''),
    // });
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
