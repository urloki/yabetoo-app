"use client";
import { signOut, useSession } from "next-auth/react";
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function debounceLeading<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout = 300,
) {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      callback(...args);
      timer = undefined;
    }, timeout);
  };
}

const debounceUpdate = debounceLeading((callback: () => void) => {
  callback();
}, 10000);

const _storageKey = "_lastActivity";
// on mount, we will listen to several possible "interactive" events
const windowEvents: WindowActivityEvent[] = [
  "focus",
  "scroll",
  "click",
  "mousemove",
];

function storage() {
  return global.window !== undefined ? window.localStorage : null;
}

function activity() {
  return new Date().getTime();
}

const parseLastActivityString = (activityStr?: string | null) => {
  if (!activityStr) return null;

  const lastActivity = +activityStr;

  const now = activity();

  if (
    lastActivity == null ||
    lastActivity > now ||
    lastActivity <= 0 ||
    Number.isNaN(lastActivity)
  ) {
    // note: some of these conditions could actually mean
    // someone is trying to tamper with your activity timer
    // use with caution
    return null;
  }

  return lastActivity;
};

const initLastActivity = () => {
  const now = activity();

  const lastActivityStr = storage()?.getItem(_storageKey);

  const lastActivity = parseLastActivityString(lastActivityStr);

  return lastActivity == null ? now : lastActivity;
};

type WindowActivityEvent = keyof WindowEventMap;

interface AutoLogoutProviderProps extends PropsWithChildren {
  timeoutMs?: number;
  timeoutCheckMs?: number;
  debug?: boolean;
  requireSession?: boolean;
}

export function AutoLogoutProvider({
  timeoutMs = 600000, // Inactivity time
  timeoutCheckMs = 10000, // Time out to check
  debug = true,
  requireSession = false,
  children,
}: AutoLogoutProviderProps) {
  const [lastActivity, setLastActivity] = useState(() => initLastActivity());
  const { data: session, status } = useSession({ required: requireSession });

  const isUserInactive = useCallback(() => {
    const now = activity();

    // maybe verify that they are authenticated?
    if (status === "authenticated") {
      const expiry = new Date(session?.expires).getTime();

      if (now > expiry) {
        if (debug) {
          console.error("User has expired======", expiry, now);
        }

        signOut().then();
        return true;
      }
    }

    if (lastActivity + timeoutMs < now) {
      if (debug) console.log("User inactive======", lastActivity, now);
      signOut().then();
      return true;
    }

    return false;
  }, [debug, lastActivity, session?.expires, status, timeoutMs]);

  const onUserActivity = useCallback(() => {
    return debounceUpdate(() => {
      const now = activity();

      if (debug) console.log("activity - resetting last activity to ", now);
      storage()?.setItem(_storageKey, now.toString());
      setLastActivity(now);
    });
  }, [debug]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    // no timer has been initialized
    if (timeoutMs === null) {
      return;
    }

    // if user is already inactive, do not init
    if (isUserInactive()) {
      return;
    }

    const onStorage = ({ key, storageArea, newValue }: StorageEvent) => {
      if (key === _storageKey && storageArea === storage()) {
        // some debugging lines
        if (debug)
          console.log(
            "remote tab activity - resetting last activity to ",
            newValue,
          );
        const lastActivity = parseLastActivityString(newValue);

        if (lastActivity !== null) {
          setLastActivity(lastActivity);
        }
      }
    };

    const onTimerElapsed = () => isUserInactive();

    // biome-ignore lint/complexity/noForEach: <explanation>
    windowEvents.forEach((eventName) => {
      window.addEventListener(eventName, onUserActivity, false);
    });

    // we will use localStorage to determine activity
    window.addEventListener("storage", onStorage, false);

    // initialize an interval to check activity
    const intervalId = window.setInterval(onTimerElapsed, timeoutCheckMs);

    return () => {
      // detach and destroy listeners on deconstructor
      // biome-ignore lint/complexity/noForEach: <explanation>
      windowEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onUserActivity, false);
      });

      window.removeEventListener("storage", onStorage, false);

      window.clearInterval(intervalId);
    };
  }, [
    debug,
    status,
    timeoutCheckMs,
    timeoutMs,
    isUserInactive,
    onUserActivity,
  ]);

  return children;
}
