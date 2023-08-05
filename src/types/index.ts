import nameSettings from "name-settings.json";

export type FetchGptResponse = {
  result: string[];
};

export type NameFormat = "lower camel case" | "upper camel case" | "snake case";
export const nameFormats = ["lower camel case", "upper camel case", "snake case"];
export type NameSettingsKeys = keyof typeof nameSettings;
export type NameTarget = "class" | "struct" | "function" | "method" | "variable";
export type NameSettings = {
  [language in NameSettingsKeys]: {
    class?: NameFormat;
    struct?: NameFormat;
    function?: NameFormat;
    method?: NameFormat;
    variable?: NameFormat;
  };
};
