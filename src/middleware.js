export { auth as middleware } from "@/auth-edge"

export const config = {
  matcher: ["/add-profile", "/profile/:path*/edit"],
};
