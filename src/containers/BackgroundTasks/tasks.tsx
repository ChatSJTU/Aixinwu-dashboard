// @ts-strict-ignore
import { ApolloQueryResult } from "@apollo/client";
import { IMessageContext } from "@dashboard/components/messages";
import {
  CheckExportFileStatusQuery,
  CheckOrderInvoicesStatusQuery,
  JobStatusEnum,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { IntlShape } from "react-intl";

import messages from "./messages";
import {
  InvoiceGenerateParams,
  OnCompletedTaskData,
  QueuedTask,
  TaskData,
  TaskStatus,
} from "./types";
import React from "react";
import { ExternalLinkIcon } from "@saleor/macaw-ui-next";
import { Link } from "@material-ui/core";

function getTaskStatus(jobStatus: JobStatusEnum): TaskStatus {
  switch (jobStatus) {
    case JobStatusEnum.SUCCESS:
      return TaskStatus.SUCCESS;
    case JobStatusEnum.PENDING:
      return TaskStatus.PENDING;
    default:
      return TaskStatus.FAILURE;
  }
}

export async function handleTask(task: QueuedTask): Promise<TaskStatus> {
  let res: OnCompletedTaskData = null;
  try {
    res = await task.handle();
    if (res.status !== TaskStatus.PENDING) {
      task.onCompleted(res);
    }
  } catch (error) {
    if (error instanceof Error) {
      task.onError(error);
    } else {
      console.error("Unknown error", error);
    }
  }

  return res.status;
}

export function handleError(error: Error) {
  throw error;
}

export function queueCustom(
  id: number,
  tasks: React.MutableRefObject<QueuedTask[]>,
  data: TaskData,
) {
  (["handle", "onCompleted"] as Array<keyof TaskData>)
    .filter(field => !data[field])
    .forEach(field => {
      throw new Error(`${field} is required when creating custom task`);
    });
  tasks.current = [
    ...tasks.current,
    {
      handle: data.handle,
      id,
      onCompleted: data.onCompleted,
      onError: data.onError || handleError,
      status: TaskStatus.PENDING,
    },
  ];
}

export function queueInvoiceGenerate(
  id: number,
  generateInvoice: InvoiceGenerateParams,
  tasks: React.MutableRefObject<QueuedTask[]>,
  fetch: () => Promise<ApolloQueryResult<CheckOrderInvoicesStatusQuery>>,
  notify: IMessageContext,
  intl: IntlShape,
) {
  throw new Error("not implemented");
  // if (!generateInvoice) {
  //   throw new Error("generateInvoice is required when creating custom task");
  // }
  // tasks.current = [
  //   ...tasks.current,
  //   {
  //     handle: async () => {
  //       const result = await fetch();
  //       const status = result.data.order.invoices.find(
  //         invoice => invoice.id === generateInvoice.invoiceId,
  //       ).status;

  //       return getTaskStatus(status);
  //     },
  //     id,
  //     onCompleted: data =>
  //       data.status === TaskStatus.SUCCESS
  //         ? notify({
  //             status: "success",
  //             text: intl.formatMessage(messages.invoiceGenerateFinishedText),
  //             title: intl.formatMessage(messages.invoiceGenerateFinishedTitle),
  //           })
  //         : notify({
  //             status: "error",
  //             text: intl.formatMessage(commonMessages.somethingWentWrong),
  //             title: intl.formatMessage(messages.invoiceGenerationFailedTitle),
  //           }),
  //     onError: handleError,
  //     status: TaskStatus.PENDING,
  //   },
  // ];
}

export function queueExport(
  id: number,
  tasks: React.MutableRefObject<QueuedTask[]>,
  fetch: () => Promise<ApolloQueryResult<CheckExportFileStatusQuery>>,
  notify: IMessageContext,
  intl: IntlShape,
) {
  tasks.current = [
    ...tasks.current,
    {
      handle: async () => {
        const result = await fetch();
        const status = result.data.exportFile.status;

        return {
          status: getTaskStatus(status),
          message: result.data.exportFile.message,
          url: result.data.exportFile.url,
        } as OnCompletedTaskData;
      },
      id,
      onCompleted: data =>
        data.status === TaskStatus.SUCCESS
          ? notify({
              status: "success",
              text: (<div>
                导出完成：<Link href={data.url!} target="_blank"><ExternalLinkIcon size="small"></ExternalLinkIcon>点击下载文件</Link>。您也可以稍后前往“数据——导出的数据”页面查看。
              </div>),
              title: intl.formatMessage(messages.exportFinishedTitle),
              autohide: null
            })
          : notify({
              status: "error",
              text: intl.formatMessage(commonMessages.somethingWentWrong),
              title: intl.formatMessage(messages.exportFailedTitle),
              autohide: null
            }),
      onError: handleError,
      status: TaskStatus.PENDING,
    },
  ];
}
