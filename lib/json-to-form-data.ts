type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue }
  | File;

interface JsonObject {
  [key: string]: JsonValue;
}

export function jsonToFormData(json: JsonObject): FormData {
  const formData = new FormData();

  function appendFormData(data: JsonValue, parentKey?: string): void {
    if (data && typeof data === "object" && !(data instanceof File)) {
      if (Array.isArray(data)) {
        // Gestion des tableaux
        data.forEach((item, index) => {
          appendFormData(
            item,
            parentKey ? `${parentKey}[${index}]` : `${parentKey}[]`,
          );
        });
      } else {
        // Gestion des objets
        Object.entries(data).forEach(([key, value]) => {
          appendFormData(value, parentKey ? `${parentKey}[${key}]` : key);
        });
      }
    } else if (data instanceof File) {
      formData.append(parentKey || "", data);
    } else if (data !== null && data !== undefined) {
      formData.append(parentKey || "", data.toString());
    }
  }

  appendFormData(json);
  return formData;
}
