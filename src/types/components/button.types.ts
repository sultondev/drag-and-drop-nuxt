export type Variants =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface ButtonProps {
  variant?: Variants;
}
