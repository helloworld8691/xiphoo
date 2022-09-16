import { Box, Button, Paper, Stack, Typography } from '@material-ui/core';
import React from 'react';
import { APP_VERSION } from './config';

export function Info() {
  return (
    <Box flex={1} bgcolor="white" mt={6.5}>
      <Stack spacing={2} margin={2} mt={3} alignItems="center">
        <Typography variant="h4">About us</Typography>
        <Typography sx={{ background: '#eee', padding: 2, borderRadius: 2 }}>
          XIPHOO is a platform for brands/manufacturers and retailers to connect
          with end customers, utilizing NFC tags proving the authenticity of
          products, enabling direct and product-related marketing, and
          optimizing the product life cycle from production to recycling. The
          end customer needs to install only a single app for various brands due
          to our universal and open platform approach.{'\n'}
          {'\n'}Start the walk - let the product talk
        </Typography>
        <Button
          href="https://www.xiphoo.com/"
          target="__blank"
          sx={{
            bgcolor: '#C69C6D',
            '&:hover, &:focus': { bgcolor: '#C69C6D' },
          }}
        >
          <Typography style={{ color: 'white' }}>Visit our Website</Typography>
        </Button>
        <h5>{APP_VERSION}</h5>
      </Stack>
    </Box>
  );
}
