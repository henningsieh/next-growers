import { Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

import Link from "next/link";

interface Props {
  growId: string;
  buttonLabel: string;
}

export default function EditGrowButton({ growId, buttonLabel }: Props) {
  return (
    <Link href={`/account/grows/edit/${growId}/editGrow`}>
      <Button
        h={32}
        miw={180}
        compact
        variant="filled"
        color="groworange"
        className="cursor-pointer"
        leftIcon={<IconEdit className="ml-1" size={22} stroke={1.8} />}
      >
        {buttonLabel}
      </Button>
    </Link>
  );
}
