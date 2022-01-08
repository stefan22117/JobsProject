import { HourglassEmpty, HourglassFull } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

const PendingIcon = ({ style }) => {
  const icons = [<HourglassEmpty />, <HourglassFull />];

  const [index, setIndex] = useState(0);
  const [rotate, setRotate] = useState(0);



  useEffect(() => {
    Promise.resolve(
      (async (i, r, _icons) => {
        if(r>=360-45){

            setRotate(0);
        }else{
            setRotate(r+45);
        }
        await setTimeout(() => {
          if (i >= _icons.length - 1) {
            setIndex(0);
          } else {
            setIndex(i + 1);
          }
          
          
        }, 1000);
      })(index, rotate, icons)
    );
  }, [index]);

  return (
      <span
      style={{
          ...style,
          display:'inline-block',
          transform: "rotate("+rotate+"deg)" ,
        }}
        >
      {icons[index]}
        </span>
  );
};

export default PendingIcon;
