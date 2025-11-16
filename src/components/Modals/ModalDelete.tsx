import { useTranslations } from 'next-intl';
import Modal from './Modal';

type ModalDeleteProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  handleSubmit: (e: any) => void;
  isLoading: boolean;
  title: string;
};
export default function ModalDelete({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  isLoading,
  title,
}: ModalDeleteProps) {
  const t = useTranslations('Header');
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={<span>{title}</span>}
      size="md"
      footer={(
        <>
          <button
            onClick={() => setIsModalOpen(false)}
            className="rounded border px-4 py-2"
            disabled={isLoading}
          >
            {t('cancel') ?? 'Cancel'}
          </button>

          <button
            onClick={e => handleSubmit(e as any)}
            className="cursor-pointer rounded-2xl border border-red-700 px-4  py-2 text-red-800 transition-background duration-300 hover:bg-red-700 hover:text-cyan-50 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? (t('deleting') ?? 'Deleting...')
              : (t('delete') ?? 'Delete')}
          </button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-zinc-900">
        <p>
          {t('delete_message') ?? 'Are you sure you want to delete this item?'}
        </p>
      </form>
    </Modal>
  );
}
