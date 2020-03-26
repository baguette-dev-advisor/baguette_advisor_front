import {Alert} from 'react-native';

export function popAlert(title,desc) {
  Alert.alert(title,desc,[ {text: 'OK'} ],{ cancelable: false });
}

export function pad(str, length, pattern, left) {
  const size = str.length;
  const missing = length - size;
  if (missing <= 0) {
    return str;
  }

  let atLeft = !!left;
  for (let i=0; i < missing; i += 1) {
    if(atLeft) {
      str = pattern + str;
    } else {
      str = str + pattern;
    }
    atLeft = !atLeft;
  }

  return str;
}
