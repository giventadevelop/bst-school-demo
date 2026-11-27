'use client';

import { useRouter } from 'next/navigation';
import AdminListSearchCombobox, {
  type AdminListSearchItem,
} from '@/components/search/ListSearchCombobox';
import { fetchPublicTypeahead } from '@/lib/publicTypeaheadSearch';

type SearchItem = AdminListSearchItem;
type FieldRecord = Record<string, unknown>;

function fieldText(item: FieldRecord, key: string) {
  const value = item[key];
  if (value == null) return '';
  return String(value).trim();
}

function joinFields(item: FieldRecord, keys: string[], separator: string) {
  return keys.map((key) => fieldText(item, key)).filter(Boolean).join(separator);
}

/**
 * Typeahead for a school list. Typing only updates suggestions.
 * Enter, a suggestion, or clearing the field commits `?q=` and returns to page 1.
 *
 * Server pages pass field names. Functions are only for a client parent such as the team page.
 */
export function SchoolListSearch<T>({
  label,
  placeholder,
  committedQuery,
  pathname,
  keep = {},
  items,
  onCommit,
  resource,
  containsFields = [],
  extraParams,
  fields = [],
  commitFields,
  primaryFields,
  secondaryFields,
  primaryFallback = '',
  getSearchFields,
  getCommitValue,
  formatPrimary,
  formatSecondary,
}: {
  label: string;
  placeholder: string;
  committedQuery: string;
  pathname: string;
  /** Query keys to keep when the search is committed. Page keys are dropped so the list starts at page 1. */
  keep?: Record<string, string | undefined>;
  items: T[];
  /** When set, the search stays on this page instead of writing `?q=` into the address. */
  onCommit?: (value: string) => void;
  resource?: string;
  containsFields?: readonly string[];
  extraParams?: Record<string, string>;
  /** Serializable field names. Used when this search is rendered from a server page. */
  fields?: string[];
  commitFields?: string[];
  primaryFields?: string[];
  secondaryFields?: string[];
  primaryFallback?: string;
  getSearchFields?: (item: T) => Array<string | number | null | undefined>;
  getCommitValue?: (item: T) => string;
  formatPrimary?: (item: T) => string;
  formatSecondary?: (item: T) => string;
}) {
  const router = useRouter();
  const inputId = `school-search-${pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'list'}`;
  const record = (item: T) => item as unknown as FieldRecord;
  const searchOf =
    getSearchFields ??
    ((item: T) => fields.map((key) => fieldText(record(item), key)));
  const commitOf =
    getCommitValue ??
    ((item: T) => joinFields(record(item), commitFields ?? primaryFields ?? [], ' '));
  const primaryOf =
    formatPrimary ??
    ((item: T) => joinFields(record(item), primaryFields ?? commitFields ?? [], ' ') || primaryFallback);
  const secondaryOf =
    formatSecondary ??
    (secondaryFields ? (item: T) => joinFields(record(item), secondaryFields, ' · ') : undefined);

  const commit = (value: string) => {
    const next = value.trim();
    if (onCommit) {
      onCommit(next);
      return;
    }
    const params = new URLSearchParams();
    for (const [key, raw] of Object.entries(keep)) {
      if (!raw || key === 'q' || key === 'page') continue;
      params.set(key, raw);
    }
    if (next) params.set('q', next);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <form
      className="school-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label htmlFor={inputId}>{label}</label>
      <AdminListSearchCombobox
        items={items as unknown as SearchItem[]}
        committedValue={committedQuery}
        onCommit={commit}
        getSearchFields={(item) => searchOf(item as T)}
        getCommitValue={(item) => commitOf(item as T)}
        formatPrimary={(item) => primaryOf(item as T)}
        formatSecondary={secondaryOf ? (item) => secondaryOf(item as T) : undefined}
        placeholder={placeholder}
        inputId={inputId}
        ariaLabel={label}
        className="school-search-combo"
        inputClassName="school-search-input"
        searchRemote={
          resource
            ? (query) =>
                fetchPublicTypeahead<SearchItem>({
                  resource,
                  query,
                  containsFields,
                  extraParams,
                })
            : undefined
        }
      />
    </form>
  );
}
