"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../lib/firebase/client";
import PostCard from "../components/PostCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(isBetween);
dayjs.extend(relativeTime);

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  publishedAt?: { seconds: number };
  releaseDate?: { seconds: number };
};

export default function Home() {
  SwiperCore.use([Autoplay]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!firestore) {
        // Firestore not configured; skip loading posts during local dev
        setPosts([]);
        setLoading(false);
        return;
      }
      const q = query(
        collection(firestore, "posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(30),
      );
      const snap = await getDocs(q);
      const items: Post[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      // Filter out posts with a future releaseDate
      setPosts(items);
      setLoading(false);
    }
    load();
  }, []);

  // Date helpers
  const today = dayjs();
  const startOfThisWeek = today.startOf("week");
  const endOfThisWeek = today.endOf("week");
  const startOfLastWeek = startOfThisWeek.subtract(1, "week");
  const endOfLastWeek = startOfThisWeek.subtract(1, "day");

  // Helper to filter unique posts by id
  function uniqueById(posts: Post[]): Post[] {
    const seen = new Set();
    return posts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }

  // What's New: published after the start of the prior calendar week
  const whatsNew = posts
    .filter((p: any) => {
      const release = p.releaseDate?.toDate
        ? dayjs(p.releaseDate.toDate())
        : dayjs(p.releaseDate);
      return release.isAfter(startOfLastWeek) && !release.isAfter(today);
    })
    .sort((a: any, b: any) => {
      const aDate = a.publishedAt?.toDate
        ? dayjs(a.publishedAt.toDate())
        : dayjs(a.publishedAt);
      const bDate = b.publishedAt?.toDate
        ? dayjs(b.publishedAt.toDate())
        : dayjs(b.publishedAt);
      return bDate.valueOf() - aDate.valueOf();
    });

  // What's to come: releaseDate in the future and not already published
  const whatsOnTheWay = posts
    .filter((p: any) => {
      let release;
      if (p.releaseDate) {
        if (typeof p.releaseDate === "object" && "seconds" in p.releaseDate) {
          release = dayjs(new Date(p.releaseDate.seconds * 1000));
        } else {
          release = dayjs(p.releaseDate);
        }
      } else {
        return false;
      }
      let published;
      if (p.publishedAt) {
        if (typeof p.publishedAt === "object" && "seconds" in p.publishedAt) {
          published = dayjs(new Date(p.publishedAt.seconds * 1000));
        } else {
          published = dayjs(p.publishedAt);
        }
      } else {
        published = null;
      }
      // Only show if release is in the future and not already published
      return release.isAfter(today);
    })
    .sort((a: any, b: any) => {
      let aDate, bDate;
      if (
        a.releaseDate &&
        typeof a.releaseDate === "object" &&
        "seconds" in a.releaseDate
      ) {
        aDate = dayjs(new Date(a.releaseDate.seconds * 1000));
      } else {
        aDate = dayjs(a.releaseDate);
      }
      if (
        b.releaseDate &&
        typeof b.releaseDate === "object" &&
        "seconds" in b.releaseDate
      ) {
        bDate = dayjs(new Date(b.releaseDate.seconds * 1000));
      } else {
        bDate = dayjs(b.releaseDate);
      }
      return aDate.valueOf() - bDate.valueOf();
    });

  // Remove posts that are already in 'What's New' or 'What's on the way' from the main list
  const whatsNewIds = new Set(whatsNew.map((p) => p.id));
  const whatsOnTheWayIds = new Set(whatsOnTheWay.map((p) => p.id));
  const mainPosts = posts.filter(
    (p) => !whatsNewIds.has(p.id) && !whatsOnTheWayIds.has(p.id),
  );

  // Latest posts (already filtered for public)
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Latest posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {whatsNew.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-tertiary">
                What's New
              </h2>
              <Swiper
                spaceBetween={48}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 2 },
                }}
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                direction="horizontal"
                loop={true}
                modules={[Autoplay]}
              >
                {uniqueById(whatsNew).map((p) => (
                  <SwiperSlide key={p.id}>
                    <div className="flex h-full">
                      <PostCard post={p} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {whatsOnTheWay.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                What's on the way
              </h2>
              <Swiper
                spaceBetween={48}
                slidesPerView={0.5}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 2 },
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                direction="horizontal"
                loop={true}
                modules={[Autoplay]}
              >
                {uniqueById(whatsOnTheWay).map((p) => {
                  let release;
                  if (p.releaseDate) {
                    if (
                      typeof p.releaseDate === "object" &&
                      "seconds" in p.releaseDate
                    ) {
                      release = dayjs(new Date(p.releaseDate.seconds * 1000));
                    } else {
                      release = dayjs(p.releaseDate);
                    }
                  } else {
                    release = dayjs();
                  }
                  const now = dayjs();
                  return (
                    <SwiperSlide key={p.id}>
                      <div className="flex h-full">
                        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 w-full">
                          <h2 className="text-2xl font-bold text-primary dark:text-tertiary mb-3">
                            {p.title}
                          </h2>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                            {p.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {p.authorName}
                            </span>
                            {p.releaseDate && (
                              <time className="text-gray-500 dark:text-gray-500">
                                {release.format("MMM D, YYYY h:mm A")}
                              </time>
                            )}
                          </div>
                          {/* Navigation disabled until publish date/time */}
                          <button
                            className="mt-4 px-4 py-2 rounded bg-gray-300 text-gray-600 cursor-not-allowed opacity-60 w-auto"
                            disabled
                          >
                            Available {release.fromNow()}
                          </button>
                        </article>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </>
      )}
    </div>
  );
}
