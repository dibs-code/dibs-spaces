import { useEffect, useRef, useState } from 'react';

interface SeekbarProps {
  min: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
}

const Seekbar = ({ min, max, value, onValueChange }: SeekbarProps) => {
  const [mouseDown, setMouseDown] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseUp = () => setMouseDown(false);
    window.addEventListener('mouseup', onMouseUp);

    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const updateValue = (clientX: number) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      let newValue = ((clientX - rect.left) / (rect.right - rect.left)) * (max - min) + min;
      newValue = Math.round(Math.min(Math.max(newValue, min), max));
      if (newValue === 0) newValue = 1;
      if (newValue === 100) newValue = 99;
      onValueChange(newValue);
    }
  };

  return (
    <>
      <div
        ref={barRef}
        className="relative bg-gray6 w-full h-2 cursor-pointer rounded-lg mb-6 md:mb-2.5"
        onMouseDown={(e) => {
          setMouseDown(true);
          updateValue(e.clientX);
        }}
        onMouseMove={(e) => mouseDown && updateValue(e.clientX)}
        onClick={(e) => updateValue(e.clientX)}
      >
        <div
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          className="absolute opacity-75 left-0 bg-secondary flex justify-center items-center pt-1 text-white rounded-full h-2 font-medium "
        ></div>
        <div
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          className="absolute bg-secondary flex justify-center items-center pt-1 text-white rounded-full w-[26px] h-[26px] font-medium -translate-x-1/2 -translate-y-1/3"
        >
          {value}
        </div>
      </div>
      <div className="seekbar__values flex justify-between w-full mt-3 select-none">
        <p className="text-white font-semibold">{1}</p>
        <p className="text-white font-semibold">{max}</p>
      </div>
    </>
  );
};

export default Seekbar;
