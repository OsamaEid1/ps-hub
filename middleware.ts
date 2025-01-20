import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import getUserCardinalities from 'app/helpers/auth/getUserCardinalities';

// Secret key for JWT verification (same key used for signing)
const encoder = new TextEncoder();
const SECRET_KEY = encoder.encode(process.env.SECRET_KEY);

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("token");
    const { pathname } = req.nextUrl;

    // If no token is found, redirect to sign in page
    if (!tokenCookie) {
        if (pathname === ("/")) 
            return;
        else 
            return NextResponse.redirect(new URL("/", req.url));
        
    }

    // Extract the token string from the RequestCookie object
    const token = tokenCookie.value;

    // Verify the JWT token
    const userCardinalities = await getUserCardinalities(token, SECRET_KEY);
    if (!userCardinalities && pathname !== "/") {
        console.error("Failed to verify token");
        return NextResponse.redirect(new URL("/", req.url));
    }

    // User Role
    const userRole = userCardinalities.role.toLowerCase();

    // Prevent Access Sign in Page When Token is Found
    if (userCardinalities && pathname === "/") {
        console.error(
            "Trying to access signIn/SignUp routes while he is already signing !"
        );
        if (userRole === "admin")
            return NextResponse.redirect(
                new URL("/admin/display-rooms", req.url)
            );
        else if (userRole === "super_admin")
            return NextResponse.redirect(
                new URL("/super-admin/manage-admins", req.url)
            );
    }

    // Check User Access Permission
    if (pathname.startsWith("/admin") && userRole !== "admin") {
        console.error(
            "Error, while trying to access unauthorized pages, ",
            `path name: ${pathname} WITH role: ${userRole}`
        );
        return NextResponse.redirect(new URL("/admin/display-rooms", req.url));
    } else if (
        pathname.startsWith("/super-admin") &&
        userRole !== "super_admin"
    ) {
        // Check Admin Access Permission
        console.error(
            "Error, while trying to access unauthorized pages, ",
            `path s name: ${pathname} WITH role: ${userRole}`
        );
        return NextResponse.redirect(
            new URL("/super-admin/manage-admins", req.url)
        );
    }

    // Proceed with the request if the token and role are valid
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except `/` and explicitly excluded patterns
        "/((?!_next/.*|api|favicon.ico|logo.png|sitemap.xml|robots.txt|globals.css).*)",
    ],
};
