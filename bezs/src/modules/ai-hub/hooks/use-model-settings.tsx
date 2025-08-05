"use client";

import { useFormik } from "formik";
import { useEffect } from "react";
import { usePreferences, defaultPreferences } from "./use-preferences";

export type TModelSettings = {
  refresh?: boolean;
};

export const useModelSettings = ({ refresh }: TModelSettings) => {
  const { getPreferences } = usePreferences();

  const formik = useFormik({
    initialValues: {
      systemPrompt: "",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1,
      topK: 5,
      maxTokens: 1000,
      googleSearchEngineId: "",
      googleSearchApiKey: "",
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    getPreferences().then((preferences) => {
      formik.setFieldValue(
        "systemPrompt",
        preferences.systemPrompt || defaultPreferences.systemPrompt
      );
      formik.setFieldValue(
        "messageLimit",
        preferences.messageLimit || defaultPreferences.messageLimit
      );
      formik.setFieldValue(
        "temperature",
        preferences.temperature || defaultPreferences.temperature
      );
      formik.setFieldValue("topP", preferences.topP || defaultPreferences.topP);
      formik.setFieldValue("topK", preferences.topK || defaultPreferences.topK);
      formik.setFieldValue(
        "maxTokens",
        preferences.maxTokens || defaultPreferences.maxTokens
      );
      formik.setFieldValue(
        "googleSearchEngineId",
        preferences.googleSearchEngineId || ""
      );
      formik.setFieldValue(
        "googleSearchApiKey",
        preferences.googleSearchApiKey || ""
      );
    });
  }, [refresh]);

  return { formik };
};
