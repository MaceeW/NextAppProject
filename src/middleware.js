export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/add-profile", "/profile/:path*/edit"],
};
