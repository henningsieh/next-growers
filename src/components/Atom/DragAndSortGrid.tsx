import { createStyles, Flex, SimpleGrid } from "@mantine/core";
import { arrayMoveImmutable } from "array-move";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";

import NextImage from "next/image";

const useStyles = createStyles((theme) => ({
  list: {
    display: "grid",
    userSelect: "none",
  },

  item: {
    overflow: "hidden",
    background: theme.colors.dark[6],
    position: "relative",
    cursor: "grab",
    //border: `solid ${theme.colors.growgreen[3]} 1px`,
  },

  dragged: {
    boxShadow: `0 0 4px 2px ${theme.colors.growgreen[3]}`,
  },
}));

// Define interface for props
interface DragAndSortGridProps {
  itemsToSort: {
    id: string;
    publicId: string;
    cloudUrl: string;
    postOrder: number;
  }[];
  setImages: Dispatch<
    SetStateAction<
      {
        id: string;
        publicId: string;
        cloudUrl: string;
        postOrder: number;
      }[]
    >
  >;
}

export default function DragAndSortGrid({
  itemsToSort,
  setImages,
}: DragAndSortGridProps) {
  const { classes } = useStyles();

  const [isDragging, setIsDragging] = useState(false);

  // Ensure that itemsToSort is updated before transforming it
  // useEffect(() => {
  //   setImages(itemsToSort);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []); // Adding an empty dependency array ensures that the effect runs only once, similar to componentDidMount

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  return (
    <>
      <SortableList
        onSortEnd={onSortEnd}
        className={classes.list}
        draggedItemClassName={classes.dragged}
      >
        <SimpleGrid
          onMouseDown={handleMouseDown}
          cols={4}
          spacing="xs"
          breakpoints={[
            // { maxWidth: "xl", cols: 4, spacing: "sm" },
            { maxWidth: "lg", cols: 4, spacing: "sm" },
            { maxWidth: "md", cols: 3, spacing: "sm" },
            { maxWidth: "sm", cols: 2, spacing: "sm" },
            // { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          {itemsToSort.map((item) => (
            <SortableItem key={item.id}>
              <Flex
                // m="xs"
                align="center"
                justify="center"
                mih={200}
                mah={220}
                className={classes.item}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                <NextImage
                  height="200"
                  width="210"
                  src={item.cloudUrl}
                  alt="image"
                  draggable="false" // Disable default image dragging behavior
                />
              </Flex>
            </SortableItem>
          ))}
        </SimpleGrid>
      </SortableList>
    </>
  );
}
