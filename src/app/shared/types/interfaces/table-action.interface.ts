export interface TableAction {
  label: string;
  icon: string;
  onAction?: (entityId: number) => void;
}
