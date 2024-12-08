import dayJs from "dayjs";

export enum TIME { // 毫秒数
  SECOND = 1000,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 60 * HOUR,
}

export enum SECOND { // 秒数
  MINUTE = 60,
  HOUR = 60 * MINUTE,
  DAY = 60 * HOUR,
}

export enum FORMAT {
  Y_M_D_H_M_S = "YYYY-MM-DD HH:mm:ss",
  Y_M_D_H_M = "YYYY-MM-DD HH:mm",
  Y_M_D = "YYYY-MM-DD",
  H_M_S = "HH:mm:ss",
  H_M = "HH:mm",
}

export const dateFormat = (
  date: string | number | Date | undefined | null,
  targetFormat: string = FORMAT.Y_M_D_H_M_S,
  parseFormat?: string // 解析的格式
): string => {
  if (date === undefined || date === null) return "";
  return parseDate(date, parseFormat).format(targetFormat);
};

export const parseDate = (
  date: string | number | Date | undefined,
  parseFormat?: string
): dayJs.Dayjs => {
  return dayJs(date, parseFormat);
};
