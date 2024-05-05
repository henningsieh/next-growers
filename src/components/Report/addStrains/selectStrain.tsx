import { Center, Loader } from "@mantine/core";

import { api } from "~/utils/api";

function SelectStrain({ breederId }: { breederId: string }) {
  const {
    data: reederStrains,
    isLoading: breederStrainsAreLoading,
    isError: breederStrainshaveErrors,
  } = api.strains.getBreederStrains.useQuery(breederId, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (breederStrainshaveErrors) {
    return <>Server Error</>;
  } else if (!breederStrainshaveErrors && breederStrainsAreLoading) {
    return (
      <Center>
        <Loader size="sm" m="xs" color="growgreen.4" />
      </Center>
    );
  } else {
    console.debug("breederStrains", reederStrains);

    return <div>{breederId}</div>;
  }
}

export default SelectStrain;
