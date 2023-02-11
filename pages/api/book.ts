// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  cal?: "cal" | "calendly";
  ev?: "connect" | "consultation" | "hwl-begin";
};

const mappings: {
  calendar: {
    cal: string;
    calendly: string;
  };
  event: {
    connect: "connect";
    consultation: "consultation";
    "hwl-begin": "hwl-begin";
  };
} = {
  calendar: {
    cal: "https://cal.com/coach-with-santosh",
    calendly: "https://calendly.com/coach-with-santosh",
  },
  event: {
    connect: "connect",
    consultation: "consultation",
    "hwl-begin": "hwl-begin",
  },
};

const calendlyExpiryDateStr: string = "6/10/2023";

function getCurrentDateStr(): string {
  const today = new Date();
  return [today.getDate(), today.getMonth() + 1, today.getFullYear()].join("/");
}

function checkIfCalendlyExpired() {
  return calendlyExpiryDateStr == getCurrentDateStr();
}

function getCalendarEvent(queryParams: QueryParams): null | string {
  if (queryParams.ev && mappings.event[queryParams.ev]) {
    let calendarBaseLink: string | null =
      queryParams.cal && mappings.calendar[queryParams.cal]
        ? mappings.calendar[queryParams.cal]
        : mappings.calendar.calendly;
    if (
      calendarBaseLink == mappings.calendar.calendly &&
      checkIfCalendlyExpired()
    ) {
      calendarBaseLink = mappings.calendar.cal;
    }
    return [calendarBaseLink, mappings.event[queryParams.ev]].join("/");
  }
  return null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryParams: QueryParams = req.query;
  const calendarEvent: null | string = getCalendarEvent(queryParams);
  console.log("calendarEvent", calendarEvent);
  if (calendarEvent) {
    return res.redirect(308, calendarEvent);
  }
  res.redirect(308, "/");
  //   res.status(200).json(queryParams);
}
