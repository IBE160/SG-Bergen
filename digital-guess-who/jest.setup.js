import '@testing-library/jest-dom';

if (typeof global.Request === 'undefined') {
    global.Request = class Request {
        constructor(input, init) {
            this.url = input;
            this.method = init?.method || 'GET';
            this.body = init?.body;
            this.headers = new Headers(init?.headers);
        }
        async json() {
            return JSON.parse(this.body);
        }
    };
}

if (typeof global.Response === 'undefined') {
    global.Response = class Response {
        constructor(body, init) {
            this.body = body;
            this.status = init?.status || 200;
            this.ok = this.status >= 200 && this.status < 300;
            this.headers = new Headers(init?.headers);
        }
        async json() {
             return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
        }
        static json(data, init) {
            return new Response(JSON.stringify(data), init);
        }
    };
}

if (typeof global.Headers === 'undefined') {
    global.Headers = class Headers extends Map {};
}
