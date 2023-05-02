import { type GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"

import { Box, Button, Group, TextInput, Textarea, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { z } from 'zod';

const schema = z.object({
  titel:       z.string().min(12, { message: 'Titel should have at least 12 letters' }),
  description: z.string().min(42, { message: 'Description should have at least 42 letters' }),
  // email: z.string().email({ message: 'Invalid email' }),
  // age: z.number().min(18, { message: 'You must be at least 18 to create an account' }),
});

export default function Form() {
  const { data: session } = useSession()
  const form = useForm({    
    validateInputOnChange: true,
    validate: zodResolver(schema),
    initialValues: {
      titel: '',
      description: '',
    },
  });

  if (session) {
  return (
    <Box maw={640} mx="auto">

      <Title pb={24} order={1}>Create a Report</Title>
      
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Titel"
          placeholder="High Life Chronicles: A Thrilling Cannabis Grow Report"
          {...form.getInputProps('titel')}
        />
        <Textarea
          withAsterisk
          label="Description"
          placeholder="Welcome to the high life with our epic cannabis grow report! Follow along as we document the journey of cultivating the finest strains of cannabis, from seed to harvest. Our expert growers will share their tips and tricks for producing big, beautiful buds that will blow your mind. Get ready to learn about the best nutrients, lighting, and growing techniques for cultivating potent and flavorful cannabis. Whether you're a seasoned cultivator or just starting out, our cannabis grow report has something for everyone. So sit back, relax, and enjoy the ride as we take you on a journey through the wonderful world of cannabis cultivation!"
          mt="sm"        autosize
          minRows={8}
          {...form.getInputProps('description')}
        />
         {/* <NumberInput
          withAsterisk
          label="Age"
          placeholder="Your age"
          mt="sm"
          {...form.getInputProps('age')}
        />  */}

        <Group position="right" mt="xl">
          <Button variant='white' type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
return <p className="text-6xl">Access Denied</p>
}


/**
 * 
 * PROTECTED PAGE
 */
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(
        ctx.req,
        ctx.res,
        authOptions
      ),
    },
  }
}