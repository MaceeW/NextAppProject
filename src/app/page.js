import styles from "./page.module.css";
import Link from "next/link";
import Filters from "@/components/Filters";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const runtime = "nodejs";

async function fetchTitles() {
  const titles = await prisma.profiles.findMany({
    distinct: ["title"],
    select: { title: true },
  });
  return titles ? titles.map((t) => t.title) : [];
}
async function getData({ title, search }) {
  const profiles = await prisma.profiles.findMany({
    where: {
      ...(title && { title: { contains: title, mode: "insensitive" } }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
  });
  return profiles;
}
export default async function Home({ searchParams }) {
  const searchParamsData = await searchParams;
  const selectedTitle = searchParamsData?.title || "";
  const search = searchParamsData?.search || "";
  const [titles, profiles] = await Promise.all([
    fetchTitles(),
    getData({ title: selectedTitle, search }),
  ]);

  return (
    <main className={styles.main}>
      <div className="section">
        <div className="container">
          <h1>Profile App </h1>
          <Filters titles={titles} title={selectedTitle} search={search} />
          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            <div className="grid">
              {profiles.map((profile) => (
                <Link key={profile.id} href={`/profile/${profile.id}`}>
                  <div className={styles["profile-card"]}>
                    <div className={styles["profile-card__image"]}>
                      <img
                        src={profile.image_url || "/vercel.svg"}
                        alt={profile.name}
                      />
                    </div>
                    <div className={styles["profile-card__content"]}>
                      <p>{profile.name}</p>
                      <p>{profile.title}</p>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
