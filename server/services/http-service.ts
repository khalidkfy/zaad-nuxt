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



    if (session?.user && session?.access_token) {
      authToken = session.access_token;
    }

    const preparedHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    };

    const lang = getHeader(this.event, 'lang') || getHeader(this.event, 'Lang');
    if (lang) {
      preparedHeaders['Lang'] = lang;
    }
     if (headers && typeof headers === 'object') {
      const allowedExternalHeaders = ['Lang', 'Accept-Language', 'Content-Type'];
      
      Object.entries(headers).forEach(([key, value]) => {
        if (allowedExternalHeaders.includes(key) && value) {
          preparedHeaders[key] = value;
        }
      });
    }

    return preparedHeaders;
   
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

    console.log(`${this.api_prefix}/${params.url}`, "deleterdeleterdeleterdeleterdeleterdeleter");
    
    return $fetch(`${this.api_prefix}/${params.url}`, {
      method: "delete",
      headers: headers,
      // body: params.body,
    });
  };
}
