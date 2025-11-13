"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {

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
    </nav>
  );
}
