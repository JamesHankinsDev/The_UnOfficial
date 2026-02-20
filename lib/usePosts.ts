import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Query,
} from "firebase/firestore";
import { firestore } from "../lib/firebase/client";

export interface UsePostsOptions {
  status?: string;
  limit?: number;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  filterFutureRelease?: boolean;
  /**
   * Optional custom query builder. If provided, it overrides the default query logic.
   * Receives the Firestore collection ref and should return a Query.
   */
  customQueryBuilder?: (colRef: ReturnType<typeof collection>) => Query;
}

export function usePosts(options: UsePostsOptions = {}) {
  const {
    status = "published",
    limit: limitCount = 30,
    orderByField = "publishedAt",
    orderDirection = "desc",
    filterFutureRelease = false,
    customQueryBuilder,
  } = options;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!firestore) {
          setPosts([]);
          setLoading(false);
          return;
        }
        const colRef = collection(firestore, "posts");
        let q: Query;
        if (customQueryBuilder) {
          q = customQueryBuilder(colRef);
        } else {
          q = query(
            colRef,
            where("status", "==", status),
            orderBy(orderByField, orderDirection),
            limit(limitCount),
          );
        }
        const snap = await getDocs(q);
        let items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        if (filterFutureRelease) {
          const now = new Date();
          items = items.filter(
            (p) =>
              !p.releaseDate ||
              (p.releaseDate.seconds
                ? new Date(p.releaseDate.seconds * 1000) <= now
                : new Date(p.releaseDate) <= now),
          );
        }
        setPosts(items);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    limitCount,
    orderByField,
    orderDirection,
    filterFutureRelease,
    customQueryBuilder,
  ]);

  return { posts, loading, error };
}
