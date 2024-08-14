import Typography from "@material-ui/core/Typography";
import React from "react";

import { makeStyles, NavigationCardBase, NavigationCardBaseProps } from "@saleor/macaw-ui";
import { Button, Text, vars } from "@saleor/macaw-ui-next";

export interface LargeCardProps extends NavigationCardBaseProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const useStyles = makeStyles(
    (theme) => ({
      boxLinkTitle: {
        fontWeight: 500,
        fontSize: '16px',
        transition: "color .2s ease",
      },
      boxLinkText: {
        fontSize: '14px',
        marginTop: theme.spacing(0.6),
      },
      icon: {
        "& svg": {
          height: 48,
          width: 48,
        },
        transition: theme.transitions.create("color", {
          duration: theme.transitions.duration.shorter,
        }),
      },
      card: {
        "&:hover": {
          boxShadow: theme.shadows[16],
          color: theme.palette.primary.main,
        },
        boxShadow: theme.shadows[0],
        textDecoration: "none",
        transition: theme.transitions.create(["color", "box-shadow"], {
          duration: theme.transitions.duration.shorter,
        }),
      },
      cardContent: {
        "&&": {
          padding: theme.spacing(4),
        },
      },
      content: {
        display: "flex",
        columnGap: theme.spacing(3),
      },
      self: {
        border: `1px solid ${vars.colors.border.default1}`,
        height: 110,
        width: 400,
        marginTop: theme.spacing(2),
        boxShadow: "none !important",
        "& .MuiCardContent-root": {
          borderRadius: vars.borderRadius[4],
        },
      },
    }),
    { name: "LargeCard" }
  );

export const LargeCard: React.FC<LargeCardProps> = ({
  icon,
  title,
  description,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <NavigationCardBase className={classes.self} {...rest}>
      <div className={classes.content}>
        <div className={classes.icon}>{icon}</div>
        <div>
          <Typography variant="subtitle1" className={classes.boxLinkTitle}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.boxLinkText}
          >
            {description}
          </Typography>
        </div>
      </div>
    </NavigationCardBase>
  );
};
