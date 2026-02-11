export function perceptualDayTime(t, slope = 10) {
  t = t % 1;
  if (t < 0) t += 1;
  const sigmoid = (x, k) => {
    const powX = Math.pow(x, k);
    const powInvX = Math.pow(1 - x, k);
    return powX / (powX + powInvX);
  };
  if (t < 0.5) {
    let localT = t * 2;
    return sigmoid(localT, slope) / 2;
  } else {
    let localT = (t - 0.5) * 2;
    return 0.5 + sigmoid(localT, slope) / 2;
  }
}

export function getSplittedTime(time, is24Hour = false) {
  return {
    hours: is24Hour ? time.getHours() : time.getHours() % 12,
    minutes: time.getMinutes(),
    seconds: time.getSeconds()
  };
}

export function getPaddedSplittedTime(time, is24Hour = false) {
  const { hours, minutes, seconds } = getSplittedTime(time, is24Hour);
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
}