"use client";

import { useFormik } from "formik";
import { useEffect } from "react";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";

export type TModelSettings = {
  refresh?: boolean;
};

export const useModelSettings = ({ refresh }: TModelSettings) => {
  const modelPreferences = useSelectedModelStore(
    (state) => state.modelPreferences
  );
  const defaultModelPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );

  const formik = useFormik({
    initialValues: {
      systemPrompt: "",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1,
      topK: 5,
      maxTokens: 1000,
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    formik.setFieldValue(
      "systemPrompt",
      modelPreferences.systemPrompt || defaultModelPreferences.systemPrompt
    );
    formik.setFieldValue(
      "messageLimit",
      modelPreferences.messageLimit || defaultModelPreferences.messageLimit
    );
    formik.setFieldValue(
      "temperature",
      modelPreferences.temperature || defaultModelPreferences.temperature
    );
    formik.setFieldValue(
      "topP",
      modelPreferences.topP || defaultModelPreferences.topP
    );
    formik.setFieldValue(
      "topK",
      modelPreferences.topK || defaultModelPreferences.topK
    );
    formik.setFieldValue(
      "maxTokens",
      modelPreferences.maxTokens || defaultModelPreferences.maxTokens
    );
  }, [refresh]);

  return { formik };
};
