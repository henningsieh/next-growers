import {
  Box,
  Group,
  Indicator,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/de";
import "dayjs/locale/en";

import { useRouter } from "next/router";

import { Locale } from "~/types";

interface PostsDatePickerProps {
  defaultDate: Date;
  postDays: number[];
  selectedDate: Date | null;
  handleSelectDate: (date: Date | null) => void;
  dateOfnewestPost: Date;
  dateOfGermination: Date;
  responsiveColumnCount: number;
}

const PostsDatePicker: React.FC<PostsDatePickerProps> = ({
  defaultDate,
  postDays,
  selectedDate,
  handleSelectDate,
  dateOfnewestPost,
  dateOfGermination,
  responsiveColumnCount,
}) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Paper py="xs" withBorder key={responsiveColumnCount}>
      <Group position="center">
        <DatePicker
          locale={router.locale === Locale.DE ? Locale.DE : Locale.EN}
          size="sm"
          renderDay={(date) => {
            const day = date.getDate();
            const calDay = date.getTime();
            const isDisabled = !postDays.includes(calDay);

            return (
              <Indicator
                className="z-20"
                disabled={isDisabled}
                size={10}
                color={theme.colors.green[8]}
                offset={-2}
              >
                <Box>{day}</Box>
              </Indicator>
            );
          }}
          defaultDate={defaultDate}
          value={selectedDate}
          onChange={handleSelectDate}
          maxDate={dateOfnewestPost}
          minDate={dateOfGermination}
          numberOfColumns={responsiveColumnCount}
          maxLevel="month"
        />
      </Group>
    </Paper>
  );
};

export default PostsDatePicker;
