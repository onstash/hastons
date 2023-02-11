// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

type QueryParams = {
  cal?: "cal" | "calendly";
  ev?: "connect";
};

const mappings: {
  cal: {
    cal: string;
    calendly: string;
  };
  ev: {
    connect: "connect";
  };
} = {
  cal: {
    cal: "https://cal.com/coach-with-santosh",
    calendly: "https://calendly.com/coach-with-santosh",
  },
  ev: {
    connect: "connect",
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //   res.status(200).json({ name: "John Doe" });
  const queryParams: QueryParams = req.query;
  if (
    queryParams.cal &&
    mappings.cal[queryParams.cal] &&
    queryParams.ev &&
    mappings.ev[queryParams.ev]
  ) {
    return res.redirect(
      308,
      `${mappings.cal[queryParams.cal]}/${mappings.ev[queryParams.ev]}`
    );
  }
  res.redirect(308, "/");
}
