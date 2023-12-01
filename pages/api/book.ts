// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  ev?: "connect" | "consultation" | "hwl-begin";
};

const mappings: {
  calendar: {
    cal: string;
  };
  event: {
    connect: "connect";
    consultation: "consultation";
    "hwl-begin": "hwl-begin";
  };
} = {
  calendar: {
    cal: "https://cal.com/coach-with-santosh",
  },
  event: {
    connect: "connect",
    consultation: "consultation",
    "hwl-begin": "hwl-begin",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryParams: QueryParams = req.query;
  return res.redirect(
    308,
    [mappings.calendar.cal, mappings.event[queryParams.ev || "connect"]].join(
      "/"
    )
  );
}
