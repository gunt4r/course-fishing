export type TableAction = {
  label: string;
  icon: any;
  action: (item: any) => void;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isDisabled?: boolean;
  isVisible?: boolean;
};
