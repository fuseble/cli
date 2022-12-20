import { getApiFunctionName } from "./functions";
import camelCase from "camelcase";
import camelcase from "camelcase";

const INITIAL = `import React from 'react';
import { useQuery, useMutation } from 'react-query';
import * as API from './services';

export const usePagination = (data?: any) => {
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
  });

  const onChange = React.useCallback((page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize });
  }, []);

  return {
    ...pagination,
    pagination,
    handlePage: onChange,
  };
};

`;

const createFunctions = (tag: string, items: any[]) => {
  let result = `export const useOpenAPI${camelCase(tag, {
    pascalCase: true,
  })} = () => {`;

  const returnValues: string[] = [];

  items.forEach((item) => {
    const { text: getText, returnValues: getReturnValues } =
      createGETFunction(item);
    const { text: postText, returnValues: postRetrunValues } =
      createActionFunction(item);

    result += getText + postText;
    returnValues.push(...getReturnValues, ...postRetrunValues);
  });

  result += `
return {
  ${returnValues.join(",")}
};
};\n\n
`;

  return result;
};

const createGETFunction = (item: any) => {
  if (item.method !== "get") return { text: "", returnValues: [] };

  let text = "";
  const splittedPath = item.path
    .split("/")
    .map((p) => p.replace("{", "").replace("}", ""));
  const camelPath = camelCase(splittedPath);
  const pascalPath = camelCase(splittedPath, { pascalCase: true });

  const paramKeys = item.parameters.reduce((acc, curr) => {
    if (
      (curr.in === "query" || curr.in === "path") &&
      curr.name !== "page" &&
      curr.name !== "limit"
    ) {
      acc.push(`${camelPath}${camelCase(curr.name, { pascalCase: true })}`);
    }
    return acc;
  }, [] as string[]);

  const returnValues: string[] = [];

  if (item.path.endsWith("s")) {
    // pagination 처리
    text += `
${paramKeys.map((paramKey) => {
  return `const [${paramKey}, set${camelCase(paramKey, {
    pascalCase: true,
  })}] = React.useState();`;
})}
const { page: ${camelPath}Page, limit: ${camelPath}Limit, handlePage: handle${pascalPath}Page } = usePagination();
const { data: ${camelPath}Data, refetch: ${camelPath}Refetch } = useQuery(['${
      item.path
    }', ${camelPath}Page, ${camelPath}Limit], () => API.${getApiFunctionName(
      "get",
      item.path
    )}({ page: ${camelPath}Page, limit: ${camelPath}Limit, ${paramKeys.join(
      ", "
    )} }), {});

const handle${pascalPath}Refetch = React.useCallback(() => {
  ${camelPath}Refetch();
}, [${camelPath}Refetch]);
    `;

    returnValues.push(
      ...paramKeys,
      ...paramKeys.map(
        (paramKey) => `set${camelcase(paramKey, { pascalCase: true })}`
      ),
      `${camelPath}Page`,
      `${camelPath}Limit`,
      `handle${pascalPath}Page`,
      `${camelPath}Data`,
      `${camelPath}Refetch`,
      `handle${pascalPath}Refetch`
    );
  } else {
    text += `
${paramKeys.map((paramKey) => {
  return `const [${paramKey}, set${camelCase(paramKey, {
    pascalCase: true,
  })}] = React.useState();`;
})}
    const { data: ${camelPath}Data, refetch: ${camelPath}Refetch } = useQuery(['${
      item.path
    }'], () => API.${getApiFunctionName("get", item.path)}({ ${paramKeys.join(
      ", "
    )} }), {
    ${
      paramKeys.length > 0
        ? `enabled: ${paramKeys.map((paramKey) => paramKey).join(" && ")},`
        : ""
    }
    retry: false,
    });
    
    const handle${pascalPath}Refetch = React.useCallback(()=> {
      ${camelPath}Refetch();
    }, []);
    `;

    returnValues.push(
      ...paramKeys,
      ...paramKeys.map(
        (paramKey) => `set${camelcase(paramKey, { pascalCase: true })}`
      ),
      `${camelPath}Data`,
      `${camelPath}Refetch`,
      `handle${pascalPath}Refetch`
    );
  }

  return { text, returnValues };
};

const createActionFunction = (item: any) => {
  if (item.method === "get") return { text: "", returnValues: [] };

  let text = "";
  const splittedPath = item.path
    .split("/")
    .map((p) => p.replace("{", "").replace("}", ""));
  const camelPath = camelCase(splittedPath);
  const pascalPath = camelCase(splittedPath, { pascalCase: true });
  const method = camelCase(item.method, { pascalCase: true });

  const paramKeys = item.parameters.reduce((acc, curr) => {
    if (curr.in === "body") {
      acc.push(curr.name);
    }
    return acc;
  }, [] as string[]);

  const bodyKeys = Object.keys(
    item?.requestBody?.content["application/json"]?.schema?.example ?? {}
  );

  text = `
${paramKeys.map((paramKey) => {
  return `const [${paramKey}${method}, set${camelCase(paramKey, {
    pascalCase: true,
  })}${method}] = React.useState();`;
})}
const [${camelPath}${method}Input, set${pascalPath}${method}Input] = React.useState<any>({
  ${bodyKeys.map((bodyKey) => `${bodyKey}: ""`).join(",")}
});

const { mutate: ${camelPath}${method}Mutate } = useMutation((props: any) => API.${getApiFunctionName(
    item.method,
    item.path
  )}(props), {
  onSuccess: (res) => {
    console.log('[onSuccess] ${method.toUpperCase()} ${item.path}', res);
  },
  onError: (err) => {
    console.log('[onError] ${method.toUpperCase()} ${item.path}', err);
  },
});

const handle${pascalPath}${method}Mutate = React.useCallback(() => {
  ${camelPath}${method}Mutate(${camelPath}${method}Input);
}, [${camelPath}${method}Input]);
`;

  return {
    text,
    returnValues: [
      ...paramKeys,
      ...paramKeys.map(
        (paramKey) => `set${camelCase(paramKey, { pascalCase: true })}`
      ),
      `${camelPath}${method}Input`,
      `set${pascalPath}${method}Input`,
      `${camelPath}${method}Mutate`,
      `handle${pascalPath}${method}Mutate`,
    ],
  };
};

export const parseOpenAPI = (
  openapi: any,
  filter?: { tag?: string; path?: string }
) => {
  let result = INITIAL;

  const tags: Record<string, any[]> = {};

  Object.entries(openapi.paths).forEach(([path, _attribute]: any) => {
    Object.entries(_attribute).forEach(([method, attribute]: any) => {
      const tag = attribute.tags[0];
      if (!filter?.tag) {
        if (!tags[tag]) tags[tag] = [{ path, tag, method, ...attribute }];
        else tags[tag].push({ path, tag, method, ...attribute });
      } else if (tag.toLowerCase().includes(filter.tag)) {
        if (!tags[tag]) tags[tag] = [{ path, tag, method, ...attribute }];
        else tags[tag].push({ path, tag, method, ...attribute });
      }
    });
  });

  Object.entries(tags).forEach(([tag, items]) => {
    if (!filter?.path) {
      result += createFunctions(tag, items);
    } else {
      console.log({
        filterPath: filter.path,
        items: items.filter((item) => item.path.includes(filter.path)),
      });
      result += createFunctions(
        tag,
        items.filter((item) => item.path.includes(filter.path))
      );
    }
  });

  return result;
};
