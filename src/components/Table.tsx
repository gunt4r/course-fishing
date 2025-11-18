import type { TableAction } from '@/types/tableAction';

import {
  Button,
  TableBody,
  TableCell,
  TableColumn,
  Table as TableComponent,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { renderValue } from '@/utils/Helpers';
import TableTitle from './TableTitle';
import '../styles/global.css';

type CellStyleMapper = (
  value: any,
  key: string,
  item: any,
) => string | undefined;

type TableProps = {
  list: Record<string, any>[];
  ommitedAttributes?: string[];
  actions?: TableAction[];
  classNamesWrapper?: string;
  cellStyleMapper?: CellStyleMapper;
  titleTable: string;
  onAddItem?: () => void;
  maxTableHeight?: number;
};

export default function TableAdmin({
  list,
  ommitedAttributes,
  actions = [],
  classNamesWrapper,
  titleTable = 'Table',
  cellStyleMapper,
  onAddItem,
  maxTableHeight = undefined,
}: TableProps) {
  if (!list || !list?.length) {
    return null;
  }
  const first = list?.[0] ?? {};
  const keys = Object.keys(first).filter(
    key => !ommitedAttributes?.includes(key),
  );
  const headerColumns = [
    ...keys.map(k => <TableColumn key={k}>{k}</TableColumn>),
    ...(actions.length > 0
      ? [<TableColumn key="actions">Actions</TableColumn>]
      : []),
  ];

  return (
    <TableComponent
      isStriped
      isVirtualized
      aria-label="Dynamic table"
      className={`scrollbar-hide h-screen w-full max-w-full rounded-md p-8 text-zinc-900 ${classNamesWrapper}`}
      classNames={{
        wrapper: `scrollbar-hide ${maxTableHeight ? '' : '!h-screen'} bg-cyan-50 rounded-xl`,
      }}
      maxTableHeight={maxTableHeight}
      rowHeight={40}
      shadow="md"
      topContent={(
        <TableTitle
          classNames="text-center"
          addItem={onAddItem}
          title={titleTable}
        />
      )}
    >
      <TableHeader>{headerColumns}</TableHeader>
      <TableBody
        className="scrollbar-hide"
        emptyContent="No rows to display."
      >
        {list.map((item, rowIndex) => {
          const cells = [
            ...keys.map((key) => {
              const rawValue = item[key];
              const displayValue = renderValue(rawValue);
              const customClass = cellStyleMapper
                ? cellStyleMapper(rawValue, key, item)
                : '';
              return (
                <TableCell
                  key={String(key)}
                  className={`scrollbar-hide max-w-32 overflow-y-hidden text-sm text-nowrap ${customClass}`}
                >
                  {displayValue}
                </TableCell>
              );
            }),
          ];

          if (actions.length > 0) {
            cells.push(
              <TableCell key="actions-cell">
                <div className="flex gap-2">
                  {actions.map((action, actionIndex) => (
                    <Tooltip
                      key={actionIndex}
                      content={action.label}
                      color={action.color}
                      classNames={{
                        base: '',
                        content: `${action.color == 'danger' && 'bg-red-700 !text-cyan-50'} ${action.color == 'default' && 'bg-cyan-50 text-zinc-900'} rounded-xl border border-zinc-800 p-4`
                      }}
                      className="text-zinc-900"
                    >
                      <Button
                        key={actionIndex}
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={action.color || 'default'}
                        onPress={() => action.action(item)}
                        isDisabled={
                          action.isDisabled || action.isVisible === false
                        }
                      >
                        <Icon icon={action.icon} />
                      </Button>
                    </Tooltip>
                  ))}
                </div>
              </TableCell>,
            );
          }

          return <TableRow key={item.id ?? rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-[#dadada47] rounded-xl' : ''}`}>{cells}</TableRow>;
        })}
      </TableBody>
    </TableComponent>
  );
}
