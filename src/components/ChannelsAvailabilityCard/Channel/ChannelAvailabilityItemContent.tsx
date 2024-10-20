// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import {
  Box,
  Checkbox,
  Divider,
  RadioGroup,
  Text,
} from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { ChannelOpts, ChannelsAvailabilityError, Messages } from "../types";
import { availabilityItemMessages } from "./messages";
import moment from "moment";
import { getLocalTime } from "../utils";

export interface ChannelContentProps {
  disabled?: boolean;
  data: ChannelData;
  errors: ChannelsAvailabilityError[];
  messages: Messages;
  onChange: (id: string, data: ChannelOpts) => void;
}

export const ChannelAvailabilityItemContent: React.FC<ChannelContentProps> = ({
  data,
  disabled,
  errors,
  messages,
  onChange,
}) => {
  const {
    availableForPurchaseAt,
    isAvailableForPurchase: isAvailable,
    isPublished,
    publishedAt,
    visibleInListings,
    id,
  } = data;
  const formData = {
    ...(availableForPurchaseAt !== undefined ? { availableForPurchaseAt } : {}),
    ...(isAvailable !== undefined
      ? { isAvailableForPurchase: isAvailable }
      : {}),
    isPublished,
    publishedAt,
    ...(visibleInListings !== undefined ? { visibleInListings } : {}),
  };
  const dateNow = useCurrentDate();
  const localizeDate = useDateLocalize();
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchaseAt !== undefined;
  const [isPublicationDate, setPublicationDate] = useState(
    publishedAt === null,
  );
  const [isAvailableDate, setAvailableDate] = useState(false);
  const intl = useIntl();
  console.log(formData)
  const visibleMessage = (date: string) =>
    intl.formatMessage(availabilityItemMessages.sinceDate, {
      date: localizeDate(date),
    });
  const formErrors = getFormErrors(
    ["availableForPurchaseAt", "publishedAt"],
    errors,
  );

  return (
    <Box display="flex" gap={3} paddingTop={3} flexDirection="column">
      <RadioGroup
        value={String(isPublished)}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isPublished: value === "true",
            publishedAt: value === "false" ? null : publishedAt,
          });
        }}
        disabled={disabled}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <RadioGroup.Item
          id={`${id}-isPublished-true`}
          value="true"
          name="isPublished"
        >
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.visibleLabel}</Text>
            {isPublished &&
              publishedAt &&
              Date.parse(publishedAt) < dateNow && (
                <Text variant="caption" color="default2">
                  {messages.visibleSecondLabel ||
                    visibleMessage(publishedAt)}
                </Text>
              )}
          </Box>
        </RadioGroup.Item>
        <RadioGroup.Item
          id={`${id}-isPublished-false`}
          value="false"
          name="isPublished"
        >
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.hiddenLabel}</Text>
            {publishedAt &&
              !isPublished &&
              Date.parse(publishedAt) >= dateNow && (
                <Text variant="caption" color="default2">
                  {messages.hiddenSecondLabel}
                </Text>
              )}
          </Box>
        </RadioGroup.Item>
      </RadioGroup>
      {!isPublished && (
        <Box display="flex" flexDirection="column" alignItems="start" gap={1}>
          <Checkbox
            onCheckedChange={(checked: boolean) => setPublicationDate(checked)}
            checked={isPublicationDate}
          >
            {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
          </Checkbox>
          {isPublicationDate && (
            <TextField
              error={!!formErrors.publishedAt}
              disabled={disabled}
              label={intl.formatMessage(availabilityItemMessages.publishOn)}
              name={`channel:publicationDate:${id}`}
              type="datetime-local"
              fullWidth={true}
              helperText={
                formErrors.publishedAt
                  ? getProductErrorMessage(formErrors.publishedAt, intl)
                  : ""
              }
              value={getLocalTime(publishedAt) || ""}
              onChange={e =>
                onChange(id, {
                  ...formData,
                  publishedAt: moment(e.target.value).tz("Asia/Shanghai").format() || null,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Box>
      )}
      {hasAvailableProps && (
        <>
          <Divider />
          <RadioGroup
            disabled={disabled}
            name={`channel:isAvailableForPurchase:${id}`}
            value={String(isAvailable)}
            onValueChange={value =>
              onChange(id, {
                ...formData,
                availableForPurchaseAt:
                  value === "false" ? null : availableForPurchaseAt,
                isAvailableForPurchase: value === "true",
              })
            }
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-true`}
              value="true"
            >
              <Box display="flex" __alignItems="baseline" gap={2}>
                <Text>{messages.availableLabel}</Text>
                {isAvailable &&
                  availableForPurchaseAt &&
                  Date.parse(availableForPurchaseAt) < dateNow && (
                    <Text variant="caption" color="default2">
                      {visibleMessage(availableForPurchaseAt)}
                    </Text>
                  )}
              </Box>
            </RadioGroup.Item>
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-false`}
              value="false"
            >
              <Box display="flex" __alignItems="baseline" gap={2}>
                <Text>{messages.unavailableLabel}</Text>
                {availableForPurchaseAt && !isAvailable && (
                  <Text variant="caption" color="default2">
                    {messages.availableSecondLabel}
                  </Text>
                )}
              </Box>
            </RadioGroup.Item>
          </RadioGroup>
          {!isAvailable && (
            <Box
              display="flex"
              gap={1}
              flexDirection="column"
              alignItems="start"
            >
              <Checkbox
                onCheckedChange={(checked: boolean) =>
                  setAvailableDate(checked)
                }
                checked={isAvailableDate}
              >
                {messages.setAvailabilityDateLabel}
              </Checkbox>
              {isAvailableDate && (
                <TextField
                  error={!!formErrors.availableForPurchaseAt}
                  disabled={disabled}
                  label={intl.formatMessage(
                    availabilityItemMessages.setAvailableOn,
                  )}
                  name={`channel:availableForPurchase:${id}`}
                  type="datetime-local"
                  fullWidth={true}
                  helperText={
                    formErrors.availableForPurchaseAt
                      ? getProductErrorMessage(
                          formErrors.availableForPurchaseAt,
                          intl,
                        )
                      : ""
                  }
                  value={getLocalTime(availableForPurchaseAt) || ""}
                  onChange={e => 
                    onChange(id, {
                      ...formData,
                      availableForPurchaseAt: moment(e.target.value).tz("Asia/Shanghai").format(),
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Box>
          )}
        </>
      )}
      {visibleInListings !== undefined && (
        <>
          <Divider />
          <Checkbox
            name={`channel:visibleInListings:${id}`}
            id={`channel:visibleInListings:${id}`}
            checked={!visibleInListings}
            disabled={disabled}
            onCheckedChange={checked => {
              onChange(id, {
                ...formData,
                visibleInListings: !checked,
              });
            }}
          >
            <Text cursor="pointer">
              {intl.formatMessage(availabilityItemMessages.hideInListings)}
            </Text>
          </Checkbox>
          <Text variant="caption" color="default2">
            {intl.formatMessage(
              availabilityItemMessages.hideInListingsDescription,
            )}
          </Text>
        </>
      )}
    </Box>
  );
};
