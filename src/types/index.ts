import nameSettings from "name-settings.json";

export type FetchGptResponse = {
  result: string[];
};

type NameFormat = "lower camel case" | "upper camel case" | "snake case";
export type NameSettingsKeys = keyof typeof nameSettings;
export type NameSettings = {
  [language in NameSettingsKeys]: Omit<{
    class: NameFormat,
    struct: NameFormat,
    function: NameFormat,
    method: NameFormat,
    variable: NameFormat,
  }, language extends "go" ? "class" : "struct">
};