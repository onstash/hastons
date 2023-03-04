// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

enum SocialMediaKey {
  insta = "insta",
  fb = "fb",
  fbPage = "fbPage",
  // fbNA = "fbNA",
  li = "li",
}
enum SocialMediaMapping {
  insta = "https://www.instagram.com/coach.with.santosh/",
  fb = "https://www.facebook.com/coach.with.santosh.venkatraman/",
  fbPage = "https://www.facebook.com/CoachWithSantosh/",
  li = "https://www.linkedin.com/in/coach-with-santosh/",
}

type QueryParams = {
  // id?: "insta" | "fb" | "fb_page" | "fb_na" | "li";
  id?: keyof typeof SocialMediaKey;
};

type socialMediaMap = Record<keyof typeof SocialMediaKey, string>;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryParams: QueryParams = req.query;
  let redirectPath: string | null = null;
  switch (queryParams.id) {
    case SocialMediaKey.insta:
    case SocialMediaKey.fb:
    case SocialMediaKey.fbPage:
    case SocialMediaKey.li:
      redirectPath = SocialMediaMapping[queryParams.id];
      break;
    default:
      redirectPath = SocialMediaMapping[SocialMediaKey.insta];
      break;
  }
  res.redirect(308, redirectPath);
}
