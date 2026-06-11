const rawBasePath = import.meta.env.BASE_URL || "/";
const cleanBasePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

const splitUrlParts = (path: string) => {
  const match = path.match(/^([^?#]*)(.*)$/);
  return {
    pathname: match?.[1] || "/",
    suffix: match?.[2] || ""
  };
};

export const withBasePath = (path = "/") => {
  if (/^[a-z]+:/i.test(path)) return path;

  const { pathname, suffix } = splitUrlParts(path);
  const normalizedPath = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "/";

  if (!cleanBasePath) {
    return `${normalizedPath}${suffix}`;
  }

  if (normalizedPath === "/") {
    return `${rawBasePath}${suffix}`;
  }

  return `${cleanBasePath}${normalizedPath}${suffix}`;
};

export const stripBasePath = (pathname: string) => {
  const normalizedPath = pathname || "/";

  if (!cleanBasePath) {
    return normalizedPath;
  }

  if (normalizedPath === cleanBasePath || normalizedPath === `${cleanBasePath}/`) {
    return "/";
  }

  if (normalizedPath.startsWith(`${cleanBasePath}/`)) {
    return normalizedPath.slice(cleanBasePath.length) || "/";
  }

  return normalizedPath;
};

export const resolveSiteUrl = (path: string, site?: string | URL) => {
  if (/^[a-z]+:/i.test(path)) return path;

  const resolvedPath = withBasePath(path);
  return site ? new URL(resolvedPath, site).href : resolvedPath;
};
