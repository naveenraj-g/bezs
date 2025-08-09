"server-only";

import { headers } from "next/headers";

export const getAppSlugServerOnly = async () => {
  const hdrs = headers();
  const url = (await hdrs).get("x-url") || "";
  const pathName = new URL(url).pathname;
  const splittedPathName = pathName.split("/").filter(Boolean);

  const appSlug = `/${splittedPathName[0]}/${splittedPathName[1]}`;

  return { appSlug };
};
