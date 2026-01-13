import { Box, VStack } from "@chakra-ui/react";

export function EstiloChakra({ children, onSubmit }) {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack
        as="form"
        spacing={4}
        p={8}
        boxShadow="md"
        borderRadius="md"
        onSubmit={onSubmit}
      >
        {children}
      </VStack>
    </Box>
  );
}

