import {
  Table as TableComponent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";

import TableTitle from "./TableTitle";
import { renderValue } from "@/utils/Helpers";
import type { TableAction } from "@/types/tableAction";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
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
  titleTable = "Table",
  cellStyleMapper,
  onAddItem,
  maxTableHeight = undefined,
}: TableProps) {
  if (!list || !list?.length) return null;
  const first = list?.[0] ?? {};
  const keys = Object.keys(first).filter(
    (key) => !ommitedAttributes?.includes(key),
  );
  const headerColumns = [
    ...keys.map((k) => <TableColumn key={k}>{k}</TableColumn>),
    ...(actions.length > 0
      ? [<TableColumn key="actions">Actions</TableColumn>]
      : []),
  ];

  return (
    <TableComponent
      isStriped
      isVirtualized
      aria-label="Dynamic table"
      className={`p-8 rounded-md text-zinc-900 w-full max-w-full h-screen scrollbar-hide ${classNamesWrapper}`}
      classNames={{
        wrapper: `scrollbar-hide ${maxTableHeight ? "" : "!h-screen"}`,
      }}
      maxTableHeight={maxTableHeight}
      rowHeight={40}
      shadow="md"
      topContent={
        <TableTitle
          classNames="text-center"
          addItem={onAddItem}
          title={titleTable}
        />
      }
    >
      <TableHeader>{headerColumns}</TableHeader>
      <TableBody
        className="scrollbar-hide"
        emptyContent={"No rows to display."}
      >
        {list.map((item, rowIndex) => {
          const cells = [
            ...keys.map((key) => {
              const rawValue = item[key];
              const displayValue = renderValue(rawValue);
              const customClass = cellStyleMapper
                ? cellStyleMapper(rawValue, key, item)
                : "";
              return (
                <TableCell
                  key={String(key)}
                  className={`text-sm max-w-32 scrollbar-hide overflow-y-hidden text-nowrap ${customClass}`}
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
                      className="text-zinc-900"
                    >
                      <Button
                        key={actionIndex}
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={action.color || "default"}
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

          return <TableRow key={item.id ?? rowIndex}>{cells}</TableRow>;
        })}
      </TableBody>
    </TableComponent>
  );
}
