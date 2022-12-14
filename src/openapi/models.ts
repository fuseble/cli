type Model = {
  name: string;
  properties: Record<string, string>;
};

export const parseOpenAPI = (openapi: any) => {
  const schemas = openapi.components.schemas;
  const models: Model[] = [];
  let result = "";

  Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
    const properties = schema.properties;
    const model: Model = { name, properties: {} };

    for (const [key, _value] of Object.entries(properties) as any) {
      const type = _value?.type;
      const $ref = _value?.$ref;

      if (!type && !$ref) {
        continue;
      }

      let value: string | undefined;
      if ($ref) {
        value = $ref.split("/").pop();
      } else if (type === "integer") {
        value = "number";
      } else if (type === "string" && Object.keys(_value).length === 1) {
        value = "string";
      } else if (type === "string" && _value.enum) {
        value = _value.enum.map((item) => `'${item}'`).join(" | ");
      } else if (type === "string" && _value.format === "date-time") {
        value = "Date | string";
      } else if (type === "array") {
        const $itemRef = _value.items?.$ref;
        if ($itemRef) {
          value = `${$itemRef.split("/").pop()}[]`;
        }
      }

      if (typeof value === "string") model.properties[key] = value;
    }

    models.push(model);
  });

  const modelNames = models.map((model) => `'${model.name}'`);
  const modelMap = models.reduce((acc, curr) => {
    acc[curr.name] = curr.properties;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  result = `export const modelNames = [${modelNames.join(
    ", "
  )}] as const;\n\n\n`;

  result += `export const modelMap = ${JSON.stringify(modelMap)};\n\n\n`;

  models.forEach((model) => {
    result += `export type ${model.name} = {
${Object.entries(model.properties)
  .map(([key, value]) => `  ${key}?: ${value};\n`)
  .join("")}}\n\n`;
  });

  return result;
};
