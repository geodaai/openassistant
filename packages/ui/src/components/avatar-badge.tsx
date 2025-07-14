// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { Icon } from "@iconify/react";
import { Avatar, Badge } from "@heroui/react";
import { ReactNode } from "react";

export const AvatarBadge = ({
  avatar,
  hasFailed,
}: {
  avatar: ReactNode | string;
  hasFailed: boolean;
}) => (
  <Badge
    isOneChar
    color="danger"
    content={
      <Icon
        className="text-background"
        icon="gravity-ui:circle-exclamation-fill"
      />
    }
    isInvisible={!hasFailed}
    placement="bottom-right"
    shape="circle"
  >
    {typeof avatar === 'string' ? (
      <Avatar showFallback src={avatar} />
    ) : (
      <Avatar showFallback icon={avatar} />
    )}
  </Badge>
);
