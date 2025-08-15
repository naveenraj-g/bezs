// import { redirect } from "@/i18n/navigation";

import { redirect } from "next/navigation";

const SettingsPage = () => {
  // redirect({ href: "/bezs/settings/account", locale: "en" });
  redirect("/bezs/dashboard/settings/account");

  return <></>;
};

export default SettingsPage;
