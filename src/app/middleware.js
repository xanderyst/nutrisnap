import { withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware(() => {
  return new Response();
});

export const config = {
  matcher: ["/api/(.*)", "/dashboard"],
};
