import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
		return NextResponse.next();
	}

	const isProtected =
		pathname.startsWith("/project") || pathname.startsWith("/team");

	if (!isProtected) {
		return NextResponse.next();
	}

	const token = request.cookies.get("authToken")?.value;

	if (!token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/project/:path*", "/team/:path*"],
};
