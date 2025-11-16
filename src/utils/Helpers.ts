import type { TableAction } from '@/types/tableAction';
import { routing } from '@/libs/I18nRouting';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

export const isServer = () => {
  return typeof window === 'undefined';
};

export const renderValue = (value: any): string | number | React.ReactNode => {
  if (
    value === null
    || value === undefined
    || value === ''
    || value === 'undefined'
  ) {
    return '-';
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === 'string' && isIsoDateString(value)) {
    const d = new Date(value);
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  }
  if (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
  ) {
    return value.toString();
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '-';
    }

    const returnValue = value.map((item) => {
      return renderValue(item);
    });
    return returnValue.join(', ');
  }

  if (typeof value === 'object') {
    if (value.name) {
      return value.name;
    }
    if (value.size) {
      return value.size;
    }
    if (value.path) {
      return value.path;
    }
    if (value.title) {
      return value.title;
    }
    if (value.email) {
      return value.email;
    }

    if (value.id) {
      return value.id;
    }
    return `Object`;
  }

  return String(value);
};

type Actions = {
  handleEdit: (item: any) => void;
  handleDelete: (item: any) => void;
  additionalActions?: TableAction[];
  isEditable?: boolean;
  isDeletable?: boolean;
};
export default function getDefaultActions({
  handleEdit,
  handleDelete,
  additionalActions = [],
  isEditable = true,
  isDeletable = true,
}: Actions) {
  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'ic:outline-edit',
      action: handleEdit,
      color: 'default',
      isDisabled: !isEditable,
      isVisible: true,
    },
    {
      label: 'Delete',
      icon: 'mingcute:close-fill',
      action: handleDelete,
      color: 'danger',
      isDisabled: !isDeletable,
      isVisible: true,
    },
  ];
  return [...actions, ...additionalActions];
}

export function defaultMapper(value: string, key: string) {
  if (key === 'status') {
    switch (value) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  }
  return '';
}
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function isIsoDateString(s: string) {
  return isoDateRegex.test(s);
}
