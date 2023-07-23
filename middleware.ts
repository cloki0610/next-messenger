import { withAuth } from "next-auth/middleware";

/*
https://nextjs.org/docs/app/building-your-application/routing/middleware
Use the file middleware.ts (or .js) in the root of your project to define Middleware.
For example, at the same level as pages or app, or inside src if applicable.
*/

export default withAuth({
    pages: {
        signIn: "/", // Set default sign-in page
    },
});

export const config = {
    matcher: ["/users/:path*"], // Set protected route path
};
