export const ADMIN_TIME_ZONE = "America/Toronto";

const adminDateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: ADMIN_TIME_ZONE,
});

const adminDatePartsFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: ADMIN_TIME_ZONE,
});

export function formatAdminDateTime(value: Date | string) {
  return adminDateTimeFormatter.format(new Date(value));
}

function getAdminDateParts(value: Date) {
  const parts = Object.fromEntries(
    adminDatePartsFormatter
      .formatToParts(value)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

function getAdminTimeZoneOffset(value: Date) {
  const parts = getAdminDateParts(value);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return representedAsUtc - Math.floor(value.getTime() / 1000) * 1000;
}

export function startOfAdminDay(value = new Date()) {
  const { year, month, day } = getAdminDateParts(value);
  const midnightAsUtc = Date.UTC(year, month - 1, day);
  let result = new Date(midnightAsUtc - getAdminTimeZoneOffset(new Date(midnightAsUtc)));

  // Recalculate at the resolved instant so daylight-saving transitions are handled.
  result = new Date(midnightAsUtc - getAdminTimeZoneOffset(result));
  return result;
}
