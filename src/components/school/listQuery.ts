/** Serializable address for a paged school list. Safe to pass into a client component. */
export type SchoolListTarget = {
  pathname: string;
  query?: string;
  /** Page query key. Defaults to `page`. Events use `upcoming` and `past`. */
  param?: string;
  extra?: Record<string, string | number | undefined>;
};

/** List URL that keeps the committed search and omits the page key on page 1. */
export function schoolListHref(
  pathname: string,
  page: number,
  query = '',
  extra: Record<string, string | number | undefined> = {},
  param = 'page',
) {
  const params = new URLSearchParams();
  const q = query.trim();
  if (q) params.set('q', q);
  for (const [key, value] of Object.entries(extra)) {
    if (value == null || value === '' || key === 'q' || key === param) continue;
    params.set(key, String(value));
  }
  if (page > 1) params.set(param, String(page));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function schoolListTargetHref(target: SchoolListTarget, page: number) {
  return schoolListHref(target.pathname, page, target.query ?? '', target.extra ?? {}, target.param ?? 'page');
}
