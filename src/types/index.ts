import nameSettings from "name-settings.json";

export type FetchGptResponse = {
  result: string[];
};

type Nameformat = "lower camel case" | "upper camel case" | "snake case";
export type NameSettingsKeys = keyof typeof nameSettings;
export type NameSettings = {
  [language in NameSettingsKeys]: {
    class?: Nameformat,
    struct?: Nameformat,
    function: Nameformat,
    method: Nameformat,
    variable: Nameformat,
  }
};