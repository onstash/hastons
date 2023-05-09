// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  id?: string;
};

const clientMapping: Record<
  string,
  {
    name: string;
    phoneNumber: string;
  }
> = Object.freeze({
  "726d5b232f47c45ecf3d5929193fb95189d98a02393b8362de16b99a7c25157e": {
    name: "Santosh Venkatraman",
    phoneNumber: "919444431801",
  },
  "20e8da4ef963db739a8badd7f1c3e11b6e4513f2cc3eb74e396f57b57944a13b": {
    name: "Adithya Krishnan (Chennai)",
    phoneNumber: "919843918350",
  },
});

function generateTrackerMessage(name: string) {
  const today = new Date();
  return `Tracker for ${name}
Date: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}

- Walking 30 minutes (or) yoga: 

- Meditation: 

- Breathing exercise/prAnAyAma: 

- 3 things I am grateful about:

- Reading book 15-30+ minutes: [What book, what did you like, etc]

- Head massage:

- Sleep time:

- Wake up time:

- Any sleep disturbance?: 

- How was your sleep?: 

- Are you feeling happy?: 

- Any other thing on your mind?:

- How else can I help you, ${name.split(" ")[0]}?: `
    .split("\n")
    .join("\n");
}

function generateWhatsAppLink({
  phoneNumber,
  message,
}: {
  phoneNumber: string;
  message: string;
}) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryParams: QueryParams = req.query;
  if (!queryParams.id) {
    return res.status(400).send("Error");
  }
  const personDetails: {
    name: string;
    phoneNumber: string;
  } = clientMapping[queryParams.id as string];
  if (!personDetails) {
    return res.status(400).send("Error");
  }
  const personalWhatsAppLink = generateWhatsAppLink({
    phoneNumber: personDetails.phoneNumber,
    message: generateTrackerMessage(personDetails.name),
  });
  res.redirect(308, personalWhatsAppLink);
}
