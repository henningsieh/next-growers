import { Center, Group, Pagination, Select } from "@mantine/core";
import { IconSelector } from "@tabler/icons-react";

import type { Dispatch, SetStateAction } from "react";

import type { IsoReportsWithPostsCountFromDb } from "~/types";

interface PaginationProps {
  isoReports: IsoReportsWithPostsCountFromDb;
  totalCount: number;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  showPerPageSelect: boolean;
}

function GrowsPagination({
  isoReports,
  totalCount,
  activePage,
  setActivePage,
  pageSize,
  setPageSize,
  showPerPageSelect = true,
}: PaginationProps) {
  {
    return (
      isoReports &&
      totalCount && (
        <Center>
          <Pagination.Root
            value={activePage}
            onChange={setActivePage}
            total={Math.ceil(totalCount / pageSize)}
            styles={(theme) => ({
              control: {
                "&[data-active]": {
                  backgroundImage: theme.fn.gradient({
                    from: "red",
                    to: "yellow",
                  }),
                  border: 0,
                },
              },
            })}
            // getItemProps={(page) => ({
            //   comonent: "Link",
            //   href: `?page=${page}`,
            // })}
            siblings={1}
            boundaries={0}
          >
            <Group spacing={5} position="center">
              <Pagination.First
                onClick={() => {
                  setActivePage(1);
                }}
              />
              <Pagination.Previous
                onClick={() => {
                  setActivePage(activePage - 1);
                }}
              />
              <Pagination.Items />
              <Pagination.Next
                onClick={() => {
                  setActivePage(activePage + 1);
                }}
              />
              <Pagination.Last
                onClick={() => {
                  setActivePage(Math.ceil(totalCount / pageSize));
                }}
              />
              {showPerPageSelect && (
                <Select
                  w={160}
                  variant="default"
                  placeholder="Custom active styles"
                  defaultValue={pageSize.toString()}
                  rightSection={<IconSelector size={20} />}
                  rightSectionWidth={30}
                  data={[
                    {
                      value: "6",
                      label: "6 Grows per page",
                      name: "6 Grows per page",
                    },
                    {
                      value: "12",
                      label: "12 Grows per page",
                      name: "12 Grows per page",
                    },
                    {
                      value: "24",
                      label: "24 Grows per page",
                      name: "24 Grows per page",
                    },
                    {
                      value: "48",
                      label: "48 Grows per page",
                      name: "48 Grows per page",
                    },
                  ]}
                  onChange={(value) => {
                    setActivePage(1);
                    !!value && setPageSize(parseInt(value, 10));
                  }}
                  styles={(theme) => ({
                    input: {
                      fontSize: theme.fontSizes.sm,
                      minHeight: 32,
                      height: 32,
                      border:
                        theme.colorScheme === "dark"
                          ? `1px solid ${theme.colors.dark[4]}`
                          : `1px solid ${theme.colors.gray[4]}`,
                    },
                    item: {
                      // height: 20,
                      // applies styles to selected item
                      "&[data-selected]": {
                        "&, &:hover": {
                          backgroundImage: theme.fn.gradient({
                            from: "red",
                            to: "yellow",
                          }),
                          // color:
                          //   theme.colorScheme === "dark"
                          //     ? theme.white
                          //     : theme.colors.teal[9],
                        },
                      },

                      // applies styles to hovered item (with mouse or keyboard)
                      "&[data-hovered]": {},
                    },
                  })}
                />
              )}
            </Group>
            {/* // MantineSelect to set pageSize */}
          </Pagination.Root>

          {/* Regular pagination */}
          {/* <Pagination
    position="center"
    withEdges
    value={activePage}
    onChange={setPage}
    siblings={1}
    boundaries={1}
    total={totalCount}
    styles={(theme) => ({
      control: {
        "&[data-active]": {
          backgroundImage: theme.fn.gradient({
            from: "red",
            to: "yellow",
          }),
          border: 0,
        },
      },
    })}
    getItemProps={(page) => ({
      component: "a",
      href: `#page-${page}`,
    })}
    getControlProps={(control) => {
      if (control === "first") {
        return { component: "a", href: "#page-0" };
      }

      if (control === "last") {
        return { component: "a", href: "#page-10" };
      }

      if (control === "next") {
        return { component: "a", href: "#page-2" };
      }

      if (control === "previous") {
        return { component: "a", href: "#page-1" };
      }

      return {};
    }}
  /> */}

          {/* Compound pagination */}
          {/* <Pagination.Root
    value={activePage}
    onChange={setPage}
    siblings={1}
    boundaries={1}
    total={totalCount / pageSize}
    styles={(theme) => ({
      control: {
        "&[data-active]": {
          backgroundImage: theme.fn.gradient({
            from: "red",
            to: "yellow",
          }),
          border: 0,
        },
      },
    })}
    getItemProps={(page) => ({
      component: "a",
      href: `#page-${page}`,
    })}
  >
    <Group spacing={7} position="center" mt="xl">
      <Pagination.First component="a" href="#page-0" />
      <Pagination.Previous
        component="a"
        href={`#page-${String(Math.max(0, activePage - 1))}`}
      />
      <Pagination.Items />
      <Pagination.Next
        component="a"
        href={`#page-${String(Math.max(0, activePage + 1))}`}
      />
      <Pagination.Last
        component="a"
        href={`#page-${String(Math.round(totalCount / pageSize))}`}
      />
    </Group>
  </Pagination.Root> */}
        </Center>
      )
    );
  }
}

export default GrowsPagination;
