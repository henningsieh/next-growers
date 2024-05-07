import { Button } from "@mantine/core";
import { IconFilePlus } from "@tabler/icons-react";

import Link from "next/link";

interface Props {
  growId: string;
  buttonLabel: string;
}

export default function AddPostButton({ growId, buttonLabel }: Props) {
  return (
    <Link href={`/account/grows/edit/${growId}/addUpdate`}>
      <Button
        h={32}
        miw={180}
        compact
        variant="filled"
        color="growgreen"
        className="cursor-pointer"
        leftIcon={
          <IconFilePlus className="ml-1" size={22} stroke={1.6} />
        }
      >
        {buttonLabel}
      </Button>
    </Link>
  );
}
