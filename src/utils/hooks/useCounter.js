import { useRef } from 'react';
import useAsyncState from './useAsyncState';

const useCounter = ({ initialValue = 0, threshold = 50, interval = 10, deltaValue = 1 }) => {
  const timerID = useRef();
  const [addition, setAddition] = useAsyncState(true);

  const timeCounter = useRef(1);
  const setTimeCounter = value => {
    timeCounter.current = value;
  };
  const [counter, setCounter] = useAsyncState(initialValue);

  const delta = num => (addition.current ? +num : -num);

  const updateCounter = addValue => setCounter(counter.current + delta(addValue));

  const timer = () => {
    if (timeCounter.current > threshold && timeCounter.current % interval === 0) {
      updateCounter(deltaValue);
    }
    setTimeCounter(timeCounter.current + 1);
    timerID.current = window.requestAnimationFrame(timer);
  };

  const startAdd = e => {
    setAddition(true);
    window.requestAnimationFrame(timer);
    e.preventDefault();
  };

  const startRemove = e => {
    setAddition(false);
    window.requestAnimationFrame(timer);
    e.preventDefault();
  };

  const stop = () => {
    if (timeCounter.current <= threshold && timeCounter.current !== 1) updateCounter(1);
    window.cancelAnimationFrame(timerID.current);
    setTimeCounter(1);
  };

  return { counter, startAdd, startRemove, stop };
};
export default useCounter;
