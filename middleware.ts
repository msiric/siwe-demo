import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/profile"];

export default withAuth(
  function middleware(req) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);
    requestHeaders.set("x-method", req.method);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        if (
          AUTH_PAGES.some((page) => pathname.startsWith(page)) &&
          token === null
        ) {
          return false;
        }
        return true;
      },
    },
  }
);
