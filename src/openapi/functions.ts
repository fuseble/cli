import camelcase from "camelcase";

const getApiFunctionName = (method: string, url: string) => {
  const splitUrl = url.split("/").map((part) => {
    if (part.includes("{") && part.includes("}")) {
      const param = part.replace("{", "").replace("}", "");
      return param;
    }
    return part;
  });

  return camelcase([method, ...splitUrl]);
};

const getApiUrlParams = (url: string) => {
  return url
    .split("/")
    .map((part) => {
      if (part.includes("{") && part.includes("}")) {
        const param = part.replace("{", "").replace("}", "");
        return param;
      }
      return undefined;
    })
    .filter(Boolean);
};

const getAPI = (method: string, url: string) => {
  const functionName = getApiFunctionName(method, url);
  const apiUrlParams = getApiUrlParams(url);
  const apiUrl = url.replace(/{/g, "${params.").replace(/}/g, "}");

  return { functionName, apiUrl };
};

const createGet = (url: string) => {
  const { functionName, apiUrl } = getAPI("get", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.get(\`${apiUrl}\`, { params });
  return data;
};
  `;
};

export const createPost = (url: string) => {
  const { functionName, apiUrl } = getAPI("post", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.post(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export const createPut = (url: string) => {
  const { functionName, apiUrl } = getAPI("put", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.put(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export const createDelete = (url: string) => {
  const { functionName, apiUrl } = getAPI("delete", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.delete(\`${apiUrl}\`, { params });
  return data;
};
  `;
};

export const createPatch = (url: string) => {
  const { functionName, apiUrl } = getAPI("patch", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.patch(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export const parseOpenAPI = (openapi: any) => {
  return Object.entries(openapi.paths).reduce((acc, [path, attribute]) => {
    Object.entries(attribute as any).forEach(([method, value]) => {
      switch (method) {
        case "get":
          acc += createGet(path);
          break;
        case "post":
          acc += createPost(path);
          break;
        case "put":
          acc += createPut(path);
          break;
        case "delete":
          acc += createDelete(path);
          break;
        case "patch":
          acc += createPatch(path);
          break;
      }
    });
    return acc;
  }, "");
};
