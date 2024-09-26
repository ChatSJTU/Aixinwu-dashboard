// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { LocalizeDate } from "@dashboard/hooks/useDateLocalize";
import { IntlShape } from "react-intl";

import { publicationMessages } from "./messages";
import { Messages } from "./types";
import moment from "moment";

export const getLocalTime = (t: string | null | undefined) => {
  if (!t) return undefined;
  return moment(t).format("YYYY-MM-DDTHH:mm");
}

export const getChannelsAvailabilityMessages = ({
  messages,
  channels = [],
  intl,
  localizeDate,
}: {
  messages?: Messages;
  channels?: ChannelData[];
  intl: IntlShape;
  localizeDate: LocalizeDate;
}): Messages =>
  channels.reduce(
    (prevVal, currVal) => ({
      ...prevVal,
      [currVal.id]: {
        ...messages,
        availableDateText:
          currVal.publishedAt && !currVal.isPublished
            ? intl.formatMessage(publicationMessages.willBecomePublishedOn, {
                date: localizeDate(currVal.publishedAt),
              })
            : currVal.publishedAt
            ? intl.formatMessage(publicationMessages.publishedSince, {
                date: localizeDate(currVal.publishedAt),
              })
            : currVal.isPublished
            ? intl.formatMessage(publicationMessages.published)
            : intl.formatMessage(publicationMessages.notPublished),
        availableLabel: intl.formatMessage(
          publicationMessages.availableForPurchase,
        ),
        availableSecondLabel: intl.formatMessage(
          publicationMessages.willBecomeAvailableOn,
          {
            date: localizeDate(currVal.availableForPurchaseAt),
          },
        ),
        hiddenSecondLabel: intl.formatMessage(
          publicationMessages.willBecomePublishedOn,
          {
            date: localizeDate(currVal.publishedAt),
          },
        ),
        setAvailabilityDateLabel: intl.formatMessage(
          publicationMessages.setAvailabilityDate,
        ),
        unavailableLabel: intl.formatMessage(
          publicationMessages.unavailableForPurchase,
        ),
      },
    }),
    {} as Messages,
  );
