import { getTranslations } from "next-intl/server";

const HomeDashboard = async () => {
  const t = await getTranslations("bezs/dashboard");

  return (
    <>
      <h1>{t("test")}</h1>
    </>
  );
};

export default HomeDashboard;
