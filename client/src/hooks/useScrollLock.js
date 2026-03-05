import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;

/**
 * Locks background scrolling when a modal/overlay is open.
 * Supports nesting — only the outermost lock applies/removes the CSS class.
 * Works on desktop and mobile (including iOS Safari).
 *
 * @param {boolean} isLocked — pass `true` to lock, `false` to unlock
 */
export default function useScrollLock(isLocked = true) {
    useEffect(() => {
        if (!isLocked) return;

        if (lockCount === 0) {
            savedScrollY = window.scrollY;
            document.documentElement.classList.add("modal-open");
            document.body.classList.add("modal-open");
            document.body.style.top = `-${savedScrollY}px`;
        }

        lockCount++;

        return () => {
            lockCount--;

            if (lockCount === 0) {
                document.documentElement.classList.remove("modal-open");
                document.body.classList.remove("modal-open");
                document.body.style.top = "";
                window.scrollTo(0, savedScrollY);
            }
        };
    }, [isLocked]);
}
