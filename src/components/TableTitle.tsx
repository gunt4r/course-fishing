import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function TableTitle({
  title,
  classNames,
  addItem,
}: {
  title: string;
  classNames?: string;
  addItem?: () => void;
}) {
  return (
    <header className="mb-4 flex  items-center">
      <p
        className={`font-semibold ${addItem ? 'ml-auto' : 'mx-auto'} my-0 text-center uppercase  ${classNames}`}
      >
        {title}
      </p>
      {addItem && (
        <Button onPress={addItem} variant="light" className="ml-auto w-fit">
          <Icon icon="mynaui:plus-solid" className="size-5" />
        </Button>
      )}
    </header>
  );
}
