import { HStack, Text } from "@chakra-ui/react";

function TotalesPedido({ totalBruto = 0, totalConIVA = 0, styles = {} }) {
  return (
    <HStack justify="space-between" sx={styles.totalesContainer ?? {}}>
      <Text>Total Bruto: {(totalBruto ?? 0).toFixed(2)}€</Text>
      <Text>Total con IVA: {(totalConIVA ?? 0).toFixed(2)}€</Text>
    </HStack>
  );
}

export default  TotalesPedido;