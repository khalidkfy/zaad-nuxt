import { H3Event, getCookie } from "h3";

export class HttpService {
  api_prefix: string | undefined;
  event: H3Event;

  constructor(event: H3Event) {
    const config = useRuntimeConfig();
    this.api_prefix = config.apiBase;
    this.event = event;
  }

  prepareRequestHeaders = async (headers?: {}): Promise<{}> => {
    const session = await getUserSession(this.event);
    let authToken = null;

    if (session?.user) {
      if (session?.access_token) {
        authToken = session?.access_token;
      }
    }
    return {
      Accept: "application/json",
      Authorization: authToken ? `Bearer ${authToken}` : "",
      ...headers,
    };
  };

  post = async (params: { url: String; body: Array<any>; headers?: {} }) => {
    const headers = await this.prepareRequestHeaders(params.headers);

    return $fetch(`${this.api_prefix}/${params.url}`, {
      method: "POST",
      headers: headers,
      body: params.body,
    });
  };

  get = async (params: { url: String; body: Array<any>; headers?: {} }) => {
    const headers = await this.prepareRequestHeaders(params.headers);

    return $fetch(`${this.api_prefix}/${params.url}`, {
      method: "GET",
      headers: headers,
      query: params.body,
    });
  };

  put = async (params: { url: String; body: Array<any>; headers?: {} }) => {
    const headers = await this.prepareRequestHeaders(params.headers);

    return $fetch(`${this.api_prefix}/${params.url}`, {
      method: "PUT",
      headers: headers,
      body: params.body,
    });
  };

  delete = async (params: { url: String; body: Array<any>; headers?: {} }) => {
    const headers = await this.prepareRequestHeaders(params.headers);

    return $fetch(`${this.api_prefix}/${params.url}`, {
      method: "delete",
      headers: headers,
      // body: params.body,
    });
  };
}
