import { useEffect, useRef, useCallback } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

// 사용자가 1시간 움직임이 없을 시 자동 로그아웃
const INACTIVITY_TIMEOUT = 1000 * 60 * 60; // 60분 (밀리초 단위).

export function useInactivityLogout() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (isSignedIn) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        console.log("활동 없음 감지: 자동 로그아웃 실행");
        signOut();
      }, INACTIVITY_TIMEOUT);
    } else {
      // 로그인 상태가 아니면 타이머 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isSignedIn, signOut]);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    if (isSignedIn) {
      events.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
      resetTimer(); // 컴포넌트 마운트 시 초기 타이머 설정
    }

    return () => {
      if (isSignedIn) {
        events.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer, isSignedIn]);
}
