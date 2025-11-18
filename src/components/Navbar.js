"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={`${styles.navbar} section`}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/add-profile">Add a Profile</Link>
        </li>
      </ul>
      <div className={styles.authSection}>
        {status === "loading" ? (
          <span>Loading...</span>
        ) : session ? (
          <>
            <span className={styles.userEmail}>{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={styles.signOutBtn}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className={styles.signInLink}>
            Log In/Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
