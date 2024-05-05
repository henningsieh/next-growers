import { Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

import Link from "next/link";

interface Props {
  growId: string;
  postId: string;
  buttonLabel: string;
}

export default function EditPostButton({
  growId,
  postId,
  buttonLabel,
}: Props) {
  return (
    // /account/edit/grow/clrlllh1e0000ky08t1fvp1pw/update/clrlnaoo30008l908laoc5m4w
    <Link href={`/account/edit/grow/${growId}/update/${postId}`}>
      <Button
        fz="sm"
        h={32}
        miw={180}
        compact
        variant="filled"
        color="groworange"
        className="cursor-pointer"
        leftIcon={<IconEdit size={22} stroke={1.6} />}
      >
        {buttonLabel}
      </Button>
    </Link>
  );
}
