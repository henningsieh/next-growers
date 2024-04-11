import {
  ActionIcon,
  Box,
  Modal,
  useMantineColorScheme,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
  IconMoodHappy,
  IconMoodHappyFilled,
} from "@tabler/icons-react";
import type { Editor } from "@tiptap/react";
import type { EmojiClickData } from "emoji-picker-react";
import { EmojiStyle, SkinTones, Theme } from "emoji-picker-react";

import { useState } from "react";

import dynamic from "next/dynamic";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

interface EmojiPickerProps {
  editor: Editor;
}

function EmojiPicker({ editor }: EmojiPickerProps) {
  const [, setPickerOpen] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const clickOutsidePicker = useClickOutside(() =>
    setPickerOpen(false)
  );

  function handleEmojiClick(
    emojiData: EmojiClickData
    // event: MouseEvent
  ) {
    editor?.commands.insertContent(emojiData.emoji);
  }

  return (
    <>
      <ActionIcon variant="default" size={24} onClick={open}>
        {/* heroicons -> face-smile */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 28 28"
          strokeWidth={1.2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>
      </ActionIcon>

      <Modal
        size={350}
        closeOnClickOutside={true}
        transitionProps={{ transition: "fade", duration: 100 }}
        withCloseButton={false}
        withOverlay={true}
        opened={opened}
        onClose={close}
        // className="absolute z-50"
      >
        <Box ref={clickOutsidePicker}>
          <Picker
            open={opened}
            emojiStyle={EmojiStyle.NATIVE}
            defaultSkinTone={SkinTones.MEDIUM}
            theme={dark ? Theme.DARK : Theme.LIGHT}
            height={360}
            width={"100%"}
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            reactionsDefaultOpen={false}
            allowExpandReactions={true}
            previewConfig={{ showPreview: false }}
          />
        </Box>
      </Modal>
    </>
  );
}

export default EmojiPicker;
