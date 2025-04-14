export interface Action {
  name: string;
  icon: string;
  nameClass: string;
  iconClass: string;
}

export interface IActionsProps {
  actions: Action[];
}

export interface IActionsEmits {
  (e: string): void;
}
