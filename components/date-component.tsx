"use client";
import { useLocale } from "next-intl";
import { format } from "@formkit/tempo";

function DateComponent({
  date,
  showTime = true,
}: {
  date: string;
  showTime?: boolean;
}) {
  const locale = useLocale();
  return (
    <span>
      {format(
        date,
        {
          date: "medium",
          time: showTime ? "short" : undefined,
        },
        locale,
      )}
    </span>
  );
}

export default DateComponent;
