import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { timeUntilEndOfDay } from '../Functions/utils';

const Cowntdown = ({ style, deadline }) => {
  const [countdownTime, setCountdownTime] = useState(timeUntilEndOfDay(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime(timeUntilEndOfDay(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text style={style}>{countdownTime}</Text>
    </View>
  );
};

export default Cowntdown;