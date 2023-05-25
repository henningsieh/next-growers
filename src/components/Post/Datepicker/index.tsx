import { Group, Indicator, useMantineTheme } from "@mantine/core";

import { DatePicker } from "@mantine/dates";
import React from "react";

interface PostsDatePickerProps {
  postDays: number[];
  selectedDate: Date | null;
  handleSelectDate: (date: Date | null) => void;
  dateOfnewestPost: Date;
  dateOfGermination: Date;
  getResponsiveColumnCount: number;
}

const PostsDatePicker: React.FC<PostsDatePickerProps> = ({
  postDays,
  selectedDate,
  handleSelectDate,
  dateOfnewestPost,
  dateOfGermination,
  getResponsiveColumnCount,
}) => {
  const theme = useMantineTheme();

  return (
    <Group position="center">
      <DatePicker
        locale="de"
        size="sm"
        renderDay={(date) => {
          const day = date.getDate();
          const calDay = date.getTime();
          const isDisabled = !postDays.includes(calDay);

          return (
            <Indicator
              disabled={isDisabled}
              size={10}
              color={theme.colors.green[8]}
              offset={-2}
            >
              <div>{day}</div>
            </Indicator>
          );
        }}
        defaultDate={selectedDate as Date}
        value={selectedDate}
        onChange={handleSelectDate}
        maxDate={dateOfnewestPost}
        minDate={dateOfGermination}
        numberOfColumns={getResponsiveColumnCount}
        maxLevel="month"
      />
    </Group>
  );
};

export default PostsDatePicker;
