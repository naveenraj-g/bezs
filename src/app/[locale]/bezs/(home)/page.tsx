import { redirect } from "next/navigation";

const BezsPage = () => {
  redirect("/bezs/dashboard");
  return null;
};

export default BezsPage;
