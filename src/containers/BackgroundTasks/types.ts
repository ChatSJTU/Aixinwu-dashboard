export enum Task {
  CUSTOM,
  EXPORT,
  INVOICE_GENERATE,
}
export enum TaskStatus {
  FAILURE,
  PENDING,
  SUCCESS,
}
export interface InvoiceGenerateParams {
  orderId: string;
  invoiceId: string;
}

export interface OnCompletedTaskData {
  status: TaskStatus;
  url: string | null;
  message: string | null;
}
export type OnCompletedTaskFn = (data: OnCompletedTaskData) => void;

export interface QueuedTask {
  id: number;
  handle: () => Promise<OnCompletedTaskData>;
  status: TaskStatus;
  onCompleted: OnCompletedTaskFn;
  onError: (error: Error) => void;
}

export interface TaskData {
  generateInvoice?: InvoiceGenerateParams;
  id?: string;
  handle?: () => Promise<OnCompletedTaskData>;
  onCompleted?: OnCompletedTaskFn;
  onError?: () => void;
}

export interface BackgroundTasksContextType {
  cancel: (id: number) => void;
  queue: (type: Task, data?: TaskData) => void;
}
