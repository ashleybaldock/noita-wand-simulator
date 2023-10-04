import { parseBooleanFromString } from '../../util';

export const decodeParamAsString = (
  param: string,
  defaultValue: string,
  log?: (s: string) => void,
) => {
  try {
    const decoded = decodeURIComponent(param.replace(/\+/g, ' '));
    return decoded.length > 0 ? decoded : defaultValue;
  } catch (e) {
    log?.(`Decode as string failed, raw value: '${param}'. Error: ${e}`);
    return defaultValue;
  }
};

export const decodeParamAsNumber = (
  param: string,
  defaultValue: number,
  log?: (s: string) => void,
) => {
  const decodedNumber = Number.parseFloat(decodeParamAsString(param, '', log));
  if (Number.isNaN(decodedNumber)) {
    log?.(`Decode as number failed, raw value: '${param}'`);
    return defaultValue;
  }
  return decodedNumber;
};

export const decodeParamAsBoolean = (
  param: string,
  defaultValue: boolean,
  log?: (s: string) => void,
) =>
  parseBooleanFromString(
    decodeParamAsString(param, '', log).toLowerCase(),
    defaultValue,
  );
