import { useEffect } from "react";

/**
 * Locks background scrolling when a modal/overlay is open.
 * Saves and restores the scroll position so the page doesn't jump.
 * Works on desktop and mobile (including iOS Safari).
 *
 * @param {boolean} isLocked — pass `true` to lock, `false` to unlock
 */
export default function useScrollLock(isLocked = true) {
    useEffect(() => {
        if (!isLocked) return;

        const scrollY = window.scrollY;

        document.documentElement.classList.add("modal-open");
        document.body.classList.add("modal-open");
        document.body.style.top = `-${scrollY}px`;

        return () => {
            document.documentElement.classList.remove("modal-open");
            document.body.classList.remove("modal-open");
            document.body.style.top = "";
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
}
