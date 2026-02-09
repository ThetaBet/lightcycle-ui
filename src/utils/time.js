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

export function getSplittedTime(time) {
  return {
    hours: time.getHours() % 12,
    minutes: time.getMinutes(),
    seconds: time.getSeconds()
  };
}