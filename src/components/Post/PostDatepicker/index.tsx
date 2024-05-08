import {
  Box,
  Group,
  Indicator,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

interface PostsDatePickerProps {
  defaultDate: Date;
  postDays: number[];
  selectedDate: Date | null;
  handleSelectDate: (date: Date | null) => void;
  dateOfnewestPost: Date;
  dateOfGermination: Date;
  responsiveColumnCount: number;
}

const PostDatepicker: React.FC<PostsDatePickerProps> = ({
  defaultDate,
  postDays,
  selectedDate,
  handleSelectDate,
  dateOfnewestPost,
  dateOfGermination,
  responsiveColumnCount,
}) => {
  const theme = useMantineTheme();
  return (
    <Paper py="xs" withBorder key={responsiveColumnCount}>
      <Group position="center">
        <DatePicker
          size="sm"
          renderDay={(date) => {
            const day = date.getDate();
            const calDay = date.getTime();

            // matches regardless of the time of timestamp
            const isDisabled = !postDays.some((postTimestamp) => {
              const postDate = new Date(postTimestamp);
              const calDate = new Date(calDay);

              return (
                calDate.getFullYear() === postDate.getFullYear() &&
                calDate.getMonth() === postDate.getMonth() &&
                calDate.getDate() === postDate.getDate()
              );
            });

            return (
              <Indicator
                className="z-20"
                disabled={isDisabled}
                size={10}
                color={theme.colors.green[8]}
                offset={-2}
              >
                <Box>
                  {day}
                  {isDisabled}
                </Box>
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

export default PostDatepicker;
