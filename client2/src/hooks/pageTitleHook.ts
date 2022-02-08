import { useEffect } from "react";

export const usePageTitle = (title: string) => {
  return useEffect(() => {
    document.title = `${title} | Our App`;
    window.scrollTo(0, 0);
  }, []);
};
